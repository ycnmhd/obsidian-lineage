<script lang="ts">
    import { getView } from '../../../../../../../context';
    import { NodeId } from 'src/stores/document/document-state-type';
    import { loadInlineEditor } from 'src/view/actions/inline-editor/load-inline-editor';
    import { expandableTextareaAction } from 'src/view/actions/inline-editor/expandable-textarea-action';

    export let nodeId: NodeId;
    const view = getView()
</script>

<div class="wrapper" use:expandableTextareaAction use:loadInlineEditor={{nodeId,view}}>

</div>

<style>
    .wrapper {
        width: 100%;
        min-height: 100px;
        max-height: 80vh;
        height: fit-content;
        overflow: hidden;
        display: flex;
    }

</style>
