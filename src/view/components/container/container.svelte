<script lang="ts">
    import Column from './column/column.svelte';
    import { keyboardShortcuts } from 'src/view/actions/keyboard-shortcuts/keyboard-shortcuts';
    import { getView } from 'src/view/components/container/context';

    const view = getView()
    const store = view.documentStore
</script>

<div
    class="columns-container"
    id="columns-container"
    tabindex="0"
    use:keyboardShortcuts={{ view }}
>
    <div class="columns">
        {#each $store.document.columns as column (column.id)}
            <Column {column} />
        {/each}
    </div>
</div>

<style>
    .columns-container {
        position: relative;
        flex: 1;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: start;
        padding-left: 100px;
        overflow-y: hidden;
        overflow-x: auto;
    }
    .columns {
        display: flex;
        align-items: center;
        width: 100%;
    }
</style>
