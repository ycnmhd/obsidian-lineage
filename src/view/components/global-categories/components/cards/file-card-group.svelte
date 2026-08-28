<script lang="ts">
    import { onDestroy, onMount, setContext } from 'svelte';
    import { TFile } from 'obsidian';
    import Lineage from 'src/main';
    import { getDocumentStoreForFile } from '../../helpers/document-store-manager';
    import {
        populateVirtualView,
        VirtualLineageView,
    } from '../../helpers/create-virtual-view';
    import CardListView from './card-list-view.svelte';
    import { ViewStore, LineageView } from 'src/view/view';
    import { ResolvedGlobalCard } from '../../helpers/tree-utils';
    import { WorkspaceLeaf } from 'obsidian';
    import { GlobalCardNavItem } from '../../helpers/global-view-keyboard';
    import {
        registerVirtualView,
        unregisterVirtualView,
    } from '../../helpers/global-view-keyboard';
    import { updateGlobalSearchResults } from '../../helpers/global-document-search';

    export let plugin: Lineage;
    export let filePath: string;
    export let cards: ResolvedGlobalCard[];
    export let viewStore: ViewStore;
    export let leaf: WorkspaceLeaf;
    export let containerEl: HTMLElement;
    export let onRemoveCard: (card: ResolvedGlobalCard) => void;
    export let onMoveCard: (card: ResolvedGlobalCard, delta: number) => void;
    export let onResolvedCards: (
        filePath: string,
        items: GlobalCardNavItem[],
    ) => void;

    // The card subtree (Node/Content/InlineEditor) reads `getView()` from
    // svelte context. Svelte actions resolve the context from the component
    // that is currently being flushed while mounting — for the async
    // `{#if ready}` block below that is THIS component — so the context must
    // be provided here (at init), not only deeper in the tree.
    const virtualView = new VirtualLineageView();
    setContext('plugin', plugin);
    setContext('view', virtualView as unknown as LineageView);

    let ready = false;
    let file: TFile | null = null;
    let failed = false;

    onMount(async () => {
        const abstractFile = plugin.app.vault.getAbstractFileByPath(filePath);
        if (!(abstractFile instanceof TFile)) {
            failed = true;
            return;
        }
        file = abstractFile;
        try {
            const { documentStore, format } = await getDocumentStoreForFile(
                plugin,
                file,
            );
            await populateVirtualView(virtualView, {
                plugin,
                file,
                documentStore,
                viewStore,
                leaf,
                containerEl,
                format,
            });
            virtualView.setContainer(containerEl);
            registerVirtualView(filePath, virtualView);
            ready = true;
            // If a search is already active, include this newly mounted file's
            // cards in the current results (one recompute, not wired to list
            // changes, so it cannot loop).
            if (viewStore.getValue().search.query) {
                updateGlobalSearchResults(viewStore);
            }
        } catch (e) {
            failed = true;
        }
    });

    onDestroy(() => {
        if (virtualView.inlineEditor) {
            virtualView.inlineEditor.unloadFile();
        }
        unregisterVirtualView(filePath);
        onResolvedCards(filePath, []);
    });
</script>

{#if ready && file}
    <div class="gc-file-group">
        <div class="gc-file-group__name">{file.basename}</div>
        <CardListView
            {plugin}
            {virtualView}
            {cards}
            {file}
            {onRemoveCard}
            {onMoveCard}
            {onResolvedCards}
        />
    </div>
{:else if failed}
    <div class="gc-file-group__missing">{filePath}</div>
{/if}

<style>
    .gc-file-group {
        width: 100%;
        max-width: 520px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .gc-file-group__name {
        font-size: var(--font-ui-smaller);
        font-weight: var(--font-semibold);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
        text-align: center;
    }

    .gc-file-group__missing {
        color: var(--text-muted);
        font-size: var(--font-ui-small);
        padding: 8px;
    }
</style>
