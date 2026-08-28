<script lang="ts">
    import { onDestroy } from 'svelte';
    import { FilteredPinnedNodesStore } from '../../../../../../stores/document/derived/filtered-pinned-nodes-store';
    import { getView } from '../../../context';
    import { ActiveStatus } from '../../../column/components/group/components/active-status.enum';
    import Node from '../../../column/components/group/components/card/card.svelte';
    import { documentStateStore } from '../../../../../../stores/view/derived/editing-store';
    import { IdSectionStore } from '../../../../../../stores/document/derived/id-section-store';
    import { ActivePinnedCardStore, ActivePinnedCategoryStore } from '../../../../../../stores/view/derived/pinned-cards-sidebar';
    import NoItems from '../no-items/no-items.svelte';
    import { PendingConfirmationStore } from 'src/stores/view/derived/pending-confirmation';
    import { NodeStylesStore } from 'src/stores/view/derived/style-rules';
    import {
        scrollActivePinnedNode
    } from 'src/view/components/container/left-sidebar/components/pinned-cards/actions/scroll-active-pinned-node';
    import { lang } from 'src/lang/lang';
    import { renderContextMenu } from 'src/obsidian/context-menu/render-context-menu';
    import { MenuItemObject } from 'src/obsidian/context-menu/render-context-menu';
    import { persistPinnedNodes } from 'src/stores/view/subscriptions/actions/persist-pinned-nodes';
    import { openGlobalCategoriesView } from 'src/obsidian/events/workspace/effects/open-global-categories-view';

    const view = getView();
    const filteredPinnedNodes = FilteredPinnedNodesStore(view);

    // global categories availability toggle (stored in settings)
    let globalCategoriesEnabled = true;
    const unsubGlobalToggle = view.plugin.settings.subscribe((state) => {
        globalCategoriesEnabled = state.categories.globalCategoriesEnabled;
    });
    onDestroy(() => unsubGlobalToggle());

    const onToggleGlobalCategories = (e: Event) => {
        const enabled = (e.target as HTMLInputElement).checked;
        if (!enabled) {
            // reset the filter if a global category was active (it won't be
            // selectable anymore once the feature is disabled)
            const globalPaths = new Set(
                $filteredPinnedNodes.globalEntries.map((g) => g.path),
            );
            if ($activeCategory && globalPaths.has($activeCategory)) {
                setActiveCategory('all');
            }
        }
        view.plugin.settings.dispatch({
            type: 'settings/categories/global/set-enabled',
            payload: { enabled },
        });
    };

    const idSection = IdSectionStore(view);
    const editingStateStore = documentStateStore(view);

    const activePinnedCard = ActivePinnedCardStore(view);
    const activeCategory = ActivePinnedCategoryStore(view);
    const pendingConfirmation = PendingConfirmationStore(view);
    const styleRules = NodeStylesStore(view);

    const setActiveCategory = (category: string) => {
        view.viewStore.dispatch({
            type: 'view/pinned-nodes/set-active-category',
            payload: { category },
        });
    };

    const onCategoryChange = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        setActiveCategory(target.value);
    };

    const onDeleteCategory = (categoryName: string) => {
        view.documentStore.dispatch({
            type: 'document/pinned-nodes/delete-category',
            payload: { name: categoryName },
        });
        // Reset active category if it was the deleted one
        if ($activeCategory === categoryName) {
            setActiveCategory('all');
        }
        persistPinnedNodes(view);
    };

    const onCategoryContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        const globalEntryPaths = new Set(
            $filteredPinnedNodes.globalEntries.map((entry) => entry.path),
        );

        const menuItems: MenuItemObject[] = [];

        if (globalCategoriesEnabled) {
            menuItems.push({
                title: lang.cm_open_global_categories,
                icon: 'globe',
                action: () => openGlobalCategoriesView(view.plugin),
            });
            menuItems.push({ type: 'separator' });
        }

        // Add "All" and "Uncategorized" options
        menuItems.push({
            title: lang.sidebar_filter_all,
            icon: 'layers',
            checked: $activeCategory === 'all',
            action: () => setActiveCategory('all'),
        });
        menuItems.push({
            title: lang.sidebar_filter_uncategorized,
            icon: 'folder-open',
            checked: $activeCategory === 'uncategorized',
            action: () => setActiveCategory('uncategorized'),
        });

        menuItems.push({ type: 'separator' });

        // Add category options
        for (const category of categories) {
            const isGlobal = globalEntryPaths.has(category);
            const items: MenuItemObject[] = [
                {
                    title: category,
                    icon: 'tag',
                    checked: $activeCategory === category,
                    action: () => setActiveCategory(category),
                },
            ];

            // Add delete option for file-specific categories only
            if (!isGlobal) {
                items.push({
                    title: lang.cm_delete_category,
                    icon: 'trash-2',
                    dangerous: true,
                    action: () => onDeleteCategory(category),
                });
            }

            menuItems.push({
                title: category,
                icon: 'tag',
                checked: $activeCategory === category,
                submenu: items,
            });
        }

        renderContextMenu(e, menuItems);
    };

    $: categories = $filteredPinnedNodes.categories;
    $: nodes = $filteredPinnedNodes.nodes;

</script>

<div class="pinned-cards-wrapper">
    <div
        class="global-categories-toggle"
        title={lang.global_categories_toggle_title}
    >
        <span class="global-categories-toggle__label">
            {lang.global_categories_toggle_label}
        </span>
        <input
            type="checkbox"
            class="global-categories-toggle__checkbox"
            checked={globalCategoriesEnabled}
            on:change={onToggleGlobalCategories}
        />
    </div>
    {#if categories.length > 0}
        <div class="category-filter" on:contextmenu={onCategoryContextMenu}>
            <select
                class="category-select"
                value={$activeCategory}
                on:change={onCategoryChange}
            >
                <option value="all">{lang.sidebar_filter_all}</option>
                <option value="uncategorized">{lang.sidebar_filter_uncategorized}</option>
                {#each categories as category}
                    <option value={category}>{category}</option>
                {/each}
            </select>
        </div>
    {/if}
    <div class="pinned-cards-container" use:scrollActivePinnedNode>
        {#if nodes.length > 0}
            {#each nodes as node (node)}
                <Node
                    {node}
                    active={$activePinnedCard === node
                        ? ActiveStatus.node
                        : ActiveStatus.sibling}
                    editing={$editingStateStore.activeNodeId === node &&
                        $editingStateStore.isInSidebar === true}
                    confirmDisableEdit={$editingStateStore.activeNodeId === node &&
                        $pendingConfirmation.disableEdit === node &&
                        $editingStateStore.isInSidebar === true}
                    confirmDelete={$pendingConfirmation.deleteNode.has(node)}
                    isInSidebar={true}
                    firstColumn={true}
                    section={$idSection[node]}
                    hasActiveChildren={false}
                    hasChildren={false}
                    selected={false}
                    pinned={false}
                    style={$styleRules.get(node)}
                    outlineMode={false}
                    collapsed={false}
                    hidden={false}
                    alwaysShowCardButtons={true}
                />
            {/each}
        {:else}
            <NoItems variant="pinned" />
        {/if}
    </div>
</div>

<style>
    .pinned-cards-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .global-categories-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 10px;
        margin-bottom: 4px;
        font-size: var(--font-ui-small);
        color: var(--text-normal);
        cursor: pointer;
        user-select: none;
    }

    .global-categories-toggle:hover {
        background-color: var(--background-modifier-hover);
    }

    .global-categories-toggle__checkbox {
        cursor: pointer;
        flex: 0 0 auto;
    }

    .category-filter {
        padding: 0 10px;
        margin-bottom: 10px;
    }

    .category-select {
        width: 100%;
        padding: 6px 8px;
        border-radius: 4px;
        border: 1px solid var(--background-modifier-border);
        background-color: var(--background-primary);
        color: var(--text-normal);
        font-size: var(--font-ui-small);
        cursor: pointer;
    }

    .category-select:hover {
        border-color: var(--interactive-accent);
    }

    .pinned-cards-container {
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        flex: 1 1 auto;
        padding-bottom: 10px;
        overflow-y: auto;
    }
</style>
