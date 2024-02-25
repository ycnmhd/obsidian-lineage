<script lang="ts">
	import { saveNodeContent } from '../../actions/save-node-content';
	import { getStore } from '../../../../../../../get-store';
	import { ColumnNode } from 'src/stores/document/document-reducer';
	import { expandableTextareaAction } from '../../actions/expandable-textarea-action';

	export let editing: boolean;
    export let node: ColumnNode;
    const store = getStore();
</script>

<textarea
    use:expandableTextareaAction
    use:saveNodeContent={{ editing, store, node }}
/>

<style>
    textarea {
        width: 100%;
        min-height: 100px;
        padding: 6px 10px;
        font-size: 16px;
        background-color: transparent;
        resize: none;
    }
</style>
