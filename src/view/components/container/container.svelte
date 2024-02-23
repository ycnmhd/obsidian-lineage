<script lang="ts">
	import Column from './column/column.svelte';
	import { DocumentStore } from 'src/view/view';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { keyboardShortcuts } from 'src/view/actions/keyboard-shortcuts/keyboard-shortcuts';

	export let store: DocumentStore;

    let ref: HTMLElement;
    onMount(() => {
        store.dispatch({ type: 'SET_CONTAINER', payload: { ref } });
    });
    onDestroy(() => {
        store.dispatch({ type: 'SET_CONTAINER', payload: { ref: null } });
    });
    setContext('store', store);
</script>

<div
    bind:this={ref}
    class="container"
    id="columns-container"
	use:keyboardShortcuts={store}
>
    <div class="columns">
        {#each $store.columns as column (column.id)}
            <Column {column} />
        {/each}
    </div>
</div>

<style>
    :root {
        --node-bg: #318bbf;
        --node-bg-active: #fff;
        --parent-bg: #68a6ca;
        --container-bg: #1d7db4;
    }
    .container {
        background-color: var(--container-bg);
        max-width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 100px;
    }
    .columns {
        display: flex;
        align-items: center;
    }
</style>
