<script lang="ts">
	import Column from './column/column.svelte';
	import { keyboardShortcuts } from 'src/view/actions/keyboard-shortcuts/keyboard-shortcuts';
	import { getStore } from 'src/view/components/container/context';

	const store = getStore();
</script>

<div
    class="container"
    id="columns-container"
    tabindex="0"
    use:keyboardShortcuts={store}
>
    <div class="columns">
        {#each $store.columns as column (column.id)}
            <Column {column} />
        {/each}
    </div>
</div>

<style>
    .container {
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
        gap: var(--node-gap);
    }
</style>
