<script lang="ts">
    import {
        saveNodeContentAction
    } from 'src/view/components/container/column/components/group/components/card/components/content/actions/textarea/save-node-content-action';
    import { getView } from '../../../../../../../context';
    import { NodeId } from 'src/stores/document/document-state-type';
    import {
        expandableTextareaAction
    } from 'src/view/components/container/column/components/group/components/card/components/content/actions/textarea/expandable-textarea-action';
    import {
        scrollTextAreaAction
    } from 'src/view/components/container/column/components/group/components/card/components/content/actions/textarea/scroll-text-area-action';

    export let editing: boolean;
    export let node: NodeId;
    const view = getView()
    const store = view.documentStore
</script>

<!--the wrapper is used to hide the textarea outline-->
<div class="wrapper">
    <textarea
        autofocus={true}
        class="no-outline"
        data-node-id={node}
		use:expandableTextareaAction
        use:saveNodeContentAction="{{ store, node }}"
        use:scrollTextAreaAction
    />
</div>

<style>
    .wrapper {
        width: 100%;
        height: fit-content;
        overflow: hidden;
        display: flex;
    }
    textarea {
        width: 100%;
        min-height: 100px;
        max-height: 80vh;
        padding: 6px 12px;
        font-size: 16px;
        background-color: transparent;
        resize: none;
        color: var(--color-active-node);
        border-radius: 0;
        border-style: none;
    }
</style>
