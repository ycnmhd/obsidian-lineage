<script lang="ts">
	import { saveNodeContent } from '../../actions/save-node-content';
	import { getStore } from '../../../../../../../context';
	import { NodeId } from 'src/stores/document/document-type';
	import { expandableTextareaAction } from '../../actions/expandable-textarea-action';

	export let editing: boolean;
    export let node: NodeId;
    const store = getStore();
</script>

<!--the wrapper is used to hide the textarea outline-->
<div class="wrapper">
    <textarea
        class="no-outline"
        use:expandableTextareaAction
        use:saveNodeContent={{ editing, store, node }}
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
        padding: 6px 12px;
        font-size: 16px;
        background-color: transparent;
        resize: none;
        color: var(--color-active-node);
        border-radius: 0;
        border-style: none;
    }
</style>
