<script lang="ts">
    import { getView } from '../../../../../../../context';
    import { draggable } from 'src/view/actions/dnd/draggable';

    export let nodeId: string;
    const view = getView();
    const documentStore = view.documentStore;
    const viewStore = view.viewStore
</script>

<div class="draggable" use:draggable={{ id: nodeId, documentStore, viewStore }}>
    <div class="drag-handle"></div>
    <div
        class="content"
        on:dblclick={() => {
            viewStore.dispatch({ type: 'DOCUMENT/ENABLE_EDIT_MODE',payload:{nodeId} });
        }}
    >
        <slot />
    </div>
</div>

<style>
    .draggable {
        width: 100%;
        background-color: transparent;
        display: flex;
        position: relative;
    }
    .drag-handle {
        height: 100%;
        width: 6px;
        background-color: transparent;
        cursor: grab;
        position: absolute;
        left: 0;
        z-index: 1;
    }
    .draggable:hover .drag-handle {
        background-size: 2px 4px;
        background-image: linear-gradient(
            0deg,
            hsla(0, 0%, 44.7%, 0.25) 20%,
            transparent 40%
        );
    }
</style>
