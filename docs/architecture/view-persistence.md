# View Persistence Architecture

## Overview

Lineage is an Obsidian plugin that provides a Miller-columns (Gingko Writer-style) Markdown editor. It uses a **three-store state architecture** to manage document data, UI state, and persistent settings.

---

## Three Stores

### 1. DocumentStore (`DocumentState`)

Holds the **parsed document tree** — the actual content structure.

```typescript
{
  document: {
    columns: Column[];           // Miller columns (each = a vertical column)
    content: { [nodeId]: { content: string } };  // card text by ID
  },
  sections: {
    id_section: { [nodeId]: sectionNumber };
    section_id: { [sectionNumber]: nodeId };
  },
  file: { frontmatter: string };
  history: DocumentHistory;      // undo/redo snapshots
  pinnedNodes: { Ids: string[] };
  meta: { groupParentIds: Set<string> };
}
```

- **In-memory only** — not saved to disk
- **Shared across tabs** — multiple Lineage views of the same file share the same `DocumentStore` (registered in `PluginStore.documents[path]`)
- Rebuilt from scratch on file open via `loadDocumentToStore()`

### 2. ViewStore (`ViewState`)

Holds **ephemeral UI state** for a single view instance.

```typescript
{
  search: { query, results, searching, showInput, fuzzySearch, showAllNodes };
  ui: { controls: { showHistorySidebar, showHelpSidebar, showSettingsSidebar, showStyleRulesModal } };
  document: {
    editing: { activeNodeId, isInSidebar };
    activeBranch: { column, group, node, childGroups, sortedParentNodes };
    dnd: { node, childGroups };
    activeNode: string;
    activeNodesOfColumn: { [columnId]: { [groupId]: nodeId } };
    selectedNodes: Set<string>;
    pendingConfirmation: { disableEdit, deleteNode };
  };
  navigationHistory: { items: NodeId[], state, context };
  pinnedNodes: { activeNode };
  recentNodes: { activeNode };
  styleRules: { nodeStyles, allMatches };
  keyboard: { shift };
  hotkeys: { searchTerm, conflictingHotkeys };
  outline: { collapsedParents, hiddenNodes };
}
```

- **Ephemeral** — created fresh per `LineageView` instance
- **Not persisted to disk** — only the `activeNode` and `collapsedParents` are saved to Settings
- Driven by a Redux-style reducer (`viewReducer`) with 40+ action types

### 3. Settings Store (`Settings`)

Holds **persistent configuration** saved to Obsidian's `data.json`.

```typescript
{
  documents: { [path]: {
    documentFormat: 'outline' | 'sections' | 'html-element';
    viewType: 'lineage' | 'markdown';
    activeSection: string | null;        // ← persisted on navigation
    pinnedSections: { sections, activeSection };
    outline: { collapsedSections: string[] };  // ← persisted on collapse/expand
  }};
  hotkeys: { customHotkeys: { [command]: { primary, secondary } } };
  view: { fontSize, theme, cardWidth, cardsGap, zoomLevel, showMinimap, ... };
  general: { defaultDocumentFormat, linkPaneType };
  styleRules: { documents: { [path]: { rules } }, global: { rules } };
}
```

- **Auto-saved** — every state change triggers `saveSettings()` via subscription
- Saved via `this.saveData()` (Obsidian's plugin data API)

---

## File Opening Flow

```
Obsidian calls setViewData(data)
  │
  ├─ activeFilePath is null?
  │   └─ YES → loadInitialData()
  │           │
  │           ├─ Check PluginStore.documents[path]
  │           │   ├─ EXISTS → useExistingStore()     (share DocumentStore)
  │           │   └─ MISSING → createStore()         (register new)
  │           │
  │           ├─ loadDocumentToStore('view-mount')
  │           │   ├─ extractFrontmatter(data) → body + frontmatter
  │           │   ├─ detectDocumentFormat(body) → 'outline' | 'sections' | 'html-element'
  │           │   └─ loadFullDocument(...)
  │           │       └─ documentStore.dispatch('document/file/load-from-disk')
  │           │           └─ format-specific parser → jsonToColumns()
  │           │               → state.document.columns + state.document.content
  │           │
  │           ├─ new InlineEditor(this) → loadFile(file)
  │           ├─ new Component() (Svelte)
  │           └─ viewSubscriptions(this) → set up all listeners
  │
  └─ activeFilePath exists → set data, then debouncedLoadDocumentToStore()
```

### Document Parsing

The raw Markdown is parsed based on format:

| Format | Parser |
|---|---|
| `outline` | `outlineToJson()` — parses indentation-based nesting |
| `sections` | `htmlCommentToJson()` — parses `<!-- section:X -->` markers |
| `html-element` | `htmlElementToJson()` — parses HTML `<div>` elements |

All parsers output a JSON tree → `jsonToColumns()` converts it to the column structure.

---

## State Restoration on File Open

After parsing, `onViewMount()` runs and restores persisted state:

```typescript
onViewMount(view) {
  // 1. Restore last active node
  setInitialActiveNode(view)
    → reads settings.documents[path].activeSection
    → sections.section_id[sectionNumber] → nodeId
    → dispatch('view/set-active-node/document', { id })

  // 2. Restore collapsed sections
  loadCollapsedSectionsFromSettings(view)
    → reads settings.documents[path].outline.collapsedSections
    → sections.section_id[sectionNumber] → nodeId[]
    → dispatch('view/outline/load-persisted-collapsed-parents', { collapsedIds })

  // 3. Load pinned nodes
  loadPinnedNodesToDocument(view)

  // 4. Apply CSS variables (font size, colors, zoom, etc.)
  applySettingsToView(view)

  // 5. Attach event listeners (hover preview, wheel scroll, modals, checkboxes)
}
```

---

## Navigation State Persistence

### Active Node

Every time the active node changes to a **different section**, the section number is persisted:

```typescript
persistActiveNodeInPluginSettings(view)
  → getSectionOfId(documentState.sections, activeNodeId)
  → settings.dispatch('settings/document/persist-active-section', { path, sectionNumber })
  → settingsReducer sets documents[path].activeSection = sectionNumber
  → subscription fires → saveSettings() → saveData()
```

### Collapsed Sections

When sections are collapsed/expanded:

```typescript
persistCollapsedSections(view)
  → collect all collapsed section numbers
  → settings.dispatch('settings/document/persist-collapsed-sections', { path, sections })
  → settingsReducer sets documents[path].outline.collapsedSections
  → subscription fires → saveSettings() → saveData()
```

### Pinned Nodes

```typescript
persistPinnedNodes(view)
  → settings.dispatch('settings/pinned-nodes/persist', { filePath, sections, section })
  → settingsReducer sets documents[path].pinnedSections
```

---

## Tab Restoration (Workspace Resume)

A Monkey-around patch on `WorkspaceLeaf.setViewState` intercepts Obsidian's workspace restoration:

```typescript
createSetViewState(plugin) {
  return (next) => (state, ...rest) => {
    if (state.type === 'markdown' && plugin.viewType[path]?.viewType === 'lineage') {
      // Rewrite to lineage view type
      return next({ ...state, type: 'lineage' }, ...rest);
    }
    return next(state, ...rest);
  };
}
```

The `plugin.viewType` map is populated by `setViewType()` when a file is first opened in Lineage mode. This ensures Obsidian's native workspace restoration re-opens Lineage views correctly.

---

## Subscription Architecture

Each `LineageView` sets up 5 subscriptions on mount:

```typescript
viewSubscriptions(view) {
  // 1. DocumentStore changes
  view.documentStore.subscribe((docState, action) => onDocumentStateUpdate(view, action))

  // 2. ViewStore changes
  view.viewStore.subscribe((viewState, action) => {
    if (initialRun) onViewMount(view)
    else onViewStateUpdate(view, action, localState)
  })

  // 3. PluginStore changes (e.g., document registration)
  view.plugin.store.subscribe((_, action) => onPluginStateUpdate(view, action))

  // 4. Settings changes (e.g., theme updates)
  view.plugin.settings.subscribe((state, action) => onPluginSettingsUpdate(view, state, action))

  // 5. Metadata cache events (e.g., file renames)
  onMetadataCache(view)
}
```

All subscriptions are cleaned up on `onUnloadFile()` / `onClose()`.

---

## Data Flow Summary

```
User Action (click/keyboard/drag)
  → Svelte component dispatches ViewStore action
    → viewReducer updates ViewState
      → onViewStateUpdate() / onDocumentStateUpdate() run
        ├─ Save to Settings (activeNode, collapsedSections)
        │   → settingsReducer → saveSettings() → saveData()
        ├─ Update UI (scroll, align, rules)
        ├─ Update Minimap
        ├─ Update Search Index
        └─ Save file to disk (data → Obsidian)
```

---

## Key Design Decisions

1. **DocumentStore is shared per file path** — multiple tabs editing the same file share the same parsed tree. Changes in one tab appear in others.

2. **ViewStore is per-instance** — each LineageView has its own view state. No sharing between tabs.

3. **Only Settings survive reloads** — `DocumentStore` and `ViewStore` are rebuilt from scratch on file open. Only `activeSection` and `collapsedSections` are restored from Settings.

4. **Auto-save on every state change** — the Settings subscription triggers `saveData()` on every mutation. This is simple but means frequent disk writes.

5. **Section numbers, not node IDs, are persisted** — because node IDs can change on reparse (e.g., after external edits), section numbers (1, 2, 3, ...) are stable and used as the persistence key.