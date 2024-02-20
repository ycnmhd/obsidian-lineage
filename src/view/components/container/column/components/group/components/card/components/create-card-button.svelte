<script lang="ts">
	import { NodePosition } from 'src/view/store/document-reducer';
	import { getStore } from 'src/view/components/container/ref';

	export let position: NodePosition;
    export let nodeId: string;
    export let parentId: string;
    const classes = {
        top: 'position-top',
        right: 'position-right',
        bottom: 'position-bottom',
    };

    const store = getStore();
    const createCard = (e: MouseEvent) => {
        e.stopPropagation();
        store.dispatch({
            type: 'CREATE_NODE',
            payload: { nodeId: nodeId, parentId, position },
        });
    };
</script>

<button class={classes[position]} on:click={createCard}>+</button>

<style>
    :root {
        --width: 30px;
        --height: 10px;
    }
    button {
        width: var(--width);
        height: var(--height);
        position: absolute;
        opacity: 0.5;
    }
    button:hover {
        opacity: 1;
    }
    .position-top {
        top: calc((-1 * var(--height)) / 2);
        left: calc(50% - calc(var(--width) / 2));
    }
    .position-bottom {
        bottom: calc((-1 * var(--height)) / 2);
        left: calc(50% - calc(var(--width) / 2));
    }
    .position-right {
        top: calc(50% - calc(var(--height) / 2));
        /*right: calc((1 * var(--width)));*/
        right: 0;
    }
</style>
