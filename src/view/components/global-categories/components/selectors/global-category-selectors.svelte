<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import {
        GlobalCategories,
    } from 'src/stores/settings/types/global-categories-types';
    import {
        collectCategoryIdsInSubtree,
        findNode,
        flattenTree,
        getDisplayPath,
    } from '../../helpers/tree-utils';
    import { lang } from 'src/lang/lang';
    import Combobox from './gc-combobox.svelte';

    export let categories: GlobalCategories;
    export let folderId: string | null = null;
    export let categoryId: string | null = null;

    const dispatch = createEventDispatcher<{
        select: { folderId: string | null; categoryId: string | null };
    }>();

    // directory selector: all folder nodes (flattened, with display paths)
    $: folderOptions = [
        { value: null, label: lang.global_categories_all_directories },
        ...flattenTree(categories.tree)
            .filter((n) => n.type === 'folder')
            .map((n) => ({
                value: n.id,
                label: getDisplayPath(categories.tree, n.id),
            })),
    ];

    // category selector: categories under the selected folder (or all)
    $: categoryOptions = (() => {
        const folderNode = folderId
            ? findNode(categories.tree, folderId)
            : null;
        const ids = folderNode
            ? collectCategoryIdsInSubtree(folderNode)
            : flattenTree(categories.tree)
                  .filter((n) => n.type === 'category')
                  .map((n) => n.id);
        return [
            { value: null, label: lang.global_categories_all_categories },
            ...ids.map((id) => ({
                value: id,
                label: getDisplayPath(categories.tree, id),
            })),
        ];
    })();

    const onFolderSelect = (e: { detail: { value: string | null } }) => {
        const nextFolderId = e.detail.value;
        // reset the category when the directory changes (cascade)
        dispatch('select', {
            folderId: nextFolderId,
            categoryId: null,
        });
    };

    const onCategorySelect = (e: { detail: { value: string | null } }) => {
        dispatch('select', { folderId, categoryId: e.detail.value });
    };
</script>

<div class="gc-selectors">
    <Combobox
        options={folderOptions}
        value={folderId}
        placeholder={lang.global_categories_select_directory}
        searchPlaceholder={lang.global_categories_search_directory}
        on:select={onFolderSelect}
    />
    <Combobox
        options={categoryOptions}
        value={categoryId}
        placeholder={lang.global_categories_select_category}
        searchPlaceholder={lang.global_categories_search_category}
        on:select={onCategorySelect}
    />
</div>

<style>
    .gc-selectors {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px 10px;
        border-bottom: 1px solid var(--background-modifier-border);
    }
</style>
