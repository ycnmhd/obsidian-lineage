<script lang="ts">
	import { saveNodeContent } from '../../actions/save-node-content';
	import { getStore } from '../../../../../../../context';
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
		padding: 5px 12px;
        font-size: 16px;
        background-color: transparent;
        resize: none;
		color: var(--color-active-node);
		border-radius: 0;
		border: 2px solid var(--background-active-node);
    }
</style>
