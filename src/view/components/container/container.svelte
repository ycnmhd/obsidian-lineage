<script lang="ts">
	import Column from './column/column.svelte';
	import { documentStore } from '../../store/document.store';
	import { container } from 'src/view/components/container/ref';
</script>

<div bind:this={container.current} class="container" id="columns-container">
    <div class="columns">
        {#each $documentStore.matrix as column (column.id)}
            <Column {column} />
        {/each}
    </div>
</div>

<style>
	:root{
		--node-bg: #318bbf;
		--node-bg-active: #fff;
		--parent-bg:#68a6ca;
		--container-bg:#1d7db4;
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
