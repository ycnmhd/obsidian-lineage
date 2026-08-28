<script lang="ts">
    import Lineage from 'src/main';
    import { lang } from 'src/lang/lang';
    import { NameModal } from 'src/view/modals/name-modal/name-modal';
    import {
        AddTarget,
        addCardToGlobalCategory,
    } from 'src/obsidian/commands/helpers/add-card-to-global-category';
    import { createNodeAndGetId } from '../helpers/create-node-and-get-id';
    import {
        collectCategoryIdsInSubtree,
        findNode,
        flattenTree,
        getCategoriesForCard,
        getDisplayPath,
    } from 'src/view/components/global-categories/helpers/tree-utils';
    import { revealCardInGlobalView } from 'src/view/components/global-categories/helpers/reveal-in-global-view';

    export let plugin: Lineage;
    export let target: AddTarget;
    export let onClose: () => void;

    type Option = { value: string | null; label: string };

    let step: 'directory' | 'category' = 'directory';
    let folderId: string | null = null;
    let query = '';
    let inputEl: HTMLInputElement;

    // The global categories this card is already in (id + display path).
    $: existingCategories = getCategoriesForCard(
        plugin.settings.getValue().categories,
        target.filePath,
        target.section,
    );

    const reveal = (categoryId: string) => {
        revealCardInGlobalView(plugin, {
            categoryId,
            filePath: target.filePath,
            section: target.section,
        });
        onClose();
    };

    // All folder nodes (any depth) in the tree.
    $: folderNodes = flattenTree(
        plugin.settings.getValue().categories.tree,
    ).filter((n) => n.type === 'folder');

    // no directories → jump straight to the category list
    $: if (step === 'directory' && folderNodes.length === 0) {
        folderId = null;
        step = 'category';
    }

    let directoryOptions: Option[] = [];
    let categoryOptions: Option[] = [];

    $: directoryOptions = [
        { value: null, label: lang.global_categories_all_directories },
        ...folderNodes.map((n) => ({
            value: n.id,
            label: getDisplayPath(
                plugin.settings.getValue().categories.tree,
                n.id,
            ),
        })),
    ];

    $: categoryOptions = (() => {
        const tree = plugin.settings.getValue().categories.tree;
        if (folderId) {
            const node = findNode(tree, folderId);
            if (!node) return [];
            return collectCategoryIdsInSubtree(node).map((id) => ({
                value: id,
                label: getDisplayPath(tree, id),
            }));
        }
        return flattenTree(tree)
            .filter((n) => n.type === 'category')
            .map((n) => ({ value: n.id, label: getDisplayPath(tree, n.id) }));
    })();

    $: options = step === 'directory' ? directoryOptions : categoryOptions;

    $: filtered = query.trim()
        ? options.filter((o) =>
              o.label.toLowerCase().includes(query.trim().toLowerCase()),
          )
        : options;

    $: if (inputEl) inputEl.focus();

    const clearQuery = () => (query = '');

    const select = (option: Option) => {
        if (step === 'directory') {
            folderId = option.value;
            step = 'category';
            clearQuery();
        } else if (option.value !== null) {
            addCardToGlobalCategory(plugin, target, option.value);
            onClose();
        }
    };

    const goBackOrClose = () => {
        if (step === 'category' && folderNodes.length > 0) {
            step = 'directory';
            clearQuery();
        } else {
            onClose();
        }
    };

    const onKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if (filtered.length > 0) select(filtered[0]);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            goBackOrClose();
        }
    };

    const newDirectory = async () => {
        const modal = new NameModal({
            plugin,
            title: lang.cm_new_folder,
            placeholder: lang.modal_new_folder_placeholder,
        });
        const name = await modal.open();
        if (!name?.trim()) return;
        const id = createNodeAndGetId(plugin, name, 'folder', null);
        if (id) {
            folderId = id;
            step = 'category';
            clearQuery();
        }
    };

    const newCategory = async () => {
        const modal = new NameModal({
            plugin,
            title: lang.cm_new_category,
            placeholder: lang.modal_new_category_placeholder,
        });
        const name = await modal.open();
        if (!name?.trim()) return;
        const id = createNodeAndGetId(plugin, name, 'category', folderId);
        if (id) {
            addCardToGlobalCategory(plugin, target, id);
            onClose();
        }
    };
</script>

<div class="atgc" on:keydown|stopPropagation>
    <div class="atgc__existing">
        {#if existingCategories.length === 0}
            <div class="atgc__existing--none">
                {lang.add_to_global_category_not_in_any}
            </div>
        {:else}
            <div class="atgc__existing-label">
                {lang.add_to_global_category_in_categories}
            </div>
            {#each existingCategories as cat (cat.id)}
                <button
                    type="button"
                    class="atgc__existing-item"
                    on:click={() => reveal(cat.id)}
                    title={cat.path}
                >
                    <span class="atgc__existing-path">{cat.path}</span>
                    <span class="atgc__existing-reveal">
                        {lang.add_to_global_category_reveal}
                    </span>
                </button>
            {/each}
        {/if}
    </div>

    {#if step === 'directory'}
        <div class="atgc__section">
            {lang.add_to_global_category_select_directory}
        </div>
    {:else}
        <div class="atgc__section">
            <button type="button" class="atgc__back" on:click={goBackOrClose}>
                ←
            </button>
            <span>{lang.add_to_global_category_select_category}</span>
        </div>
    {/if}

    <input
        bind:this={inputEl}
        bind:value={query}
        class="atgc__search"
        placeholder={step === 'directory'
            ? lang.global_categories_search_directory
            : lang.global_categories_search_category}
        on:keydown={onKeydown}
    />

    <div class="atgc__list">
        {#if filtered.length === 0}
            <div class="atgc__empty">{lang.global_categories_no_matches}</div>
        {:else}
            {#each filtered as option (option.value ?? '__all__')}
                <button
                    type="button"
                    class="atgc__option"
                    class:atgc__option--all={option.value === null}
                    on:click={() => select(option)}
                >
                    {option.label}
                </button>
            {/each}
        {/if}
    </div>

    <div class="atgc__footer">
        {#if step === 'directory'}
            <button type="button" class="atgc__create" on:click={newDirectory}>
                + {lang.add_to_global_category_create_directory}
            </button>
        {:else}
            <button type="button" class="atgc__create" on:click={newCategory}>
                + {lang.add_to_global_category_create_category}
            </button>
        {/if}
    </div>
</div>

<style>
    .atgc {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 220px;
    }

    .atgc__existing {
        display: flex;
        flex-direction: column;
        gap: 4px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        padding: 6px 8px;
        background-color: var(--background-secondary);
    }

    .atgc__existing--none {
        color: var(--text-muted);
        font-size: var(--font-ui-small);
    }

    .atgc__existing-label {
        color: var(--text-muted);
        font-size: var(--font-ui-small);
        font-weight: var(--font-semibold);
    }

    .atgc__existing-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        text-align: left;
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        background: none;
        cursor: pointer;
        font-size: var(--font-ui-small);
    }

    .atgc__existing-item:hover {
        background-color: var(--background-modifier-hover);
    }

    .atgc__existing-path {
        color: var(--text-normal);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .atgc__existing-reveal {
        flex: 0 0 auto;
        color: var(--text-accent);
        font-weight: var(--font-semibold);
    }

    .atgc__section {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-muted);
        font-size: var(--font-ui-small);
        font-weight: var(--font-semibold);
    }

    .atgc__back {
        border: none;
        background: none;
        color: var(--text-muted);
        font-size: 14px;
        cursor: pointer;
        padding: 0 4px;
    }

    .atgc__back:hover {
        color: var(--text-normal);
    }

    .atgc__search {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        background-color: var(--background-secondary);
        color: var(--text-normal);
        font-size: var(--font-ui-small);
        outline: none;
    }

    .atgc__search:focus {
        box-shadow: inset 0 0 0 1px var(--interactive-accent);
    }

    .atgc__list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-height: 240px;
        overflow-y: auto;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        padding: 4px;
    }

    .atgc__option {
        text-align: left;
        padding: 5px 8px;
        border: none;
        border-radius: 4px;
        background: none;
        color: var(--text-normal);
        font-size: var(--font-ui-small);
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .atgc__option:hover {
        background-color: var(--background-modifier-hover);
    }

    .atgc__option--all {
        color: var(--text-accent);
        font-weight: var(--font-semibold);
    }

    .atgc__empty {
        padding: 8px;
        color: var(--text-muted);
        font-size: var(--font-ui-small);
        text-align: center;
    }

    .atgc__footer {
        display: flex;
        justify-content: flex-end;
    }

    .atgc__create {
        padding: 5px 10px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        background-color: var(--background-secondary);
        color: var(--text-normal);
        font-size: var(--font-ui-small);
        cursor: pointer;
    }

    .atgc__create:hover {
        background-color: var(--interactive-hover);
        border-color: var(--interactive-accent);
    }
</style>
