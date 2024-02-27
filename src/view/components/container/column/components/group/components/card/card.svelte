<script lang="ts">
	import { ColumnNode } from 'src/stores/document/document-reducer';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
	import Draggable from './components/dnd/draggable.svelte';
	import Droppable from './components/dnd/droppable.svelte';
	import TextArea from './components/content/textarea.svelte';
	import Content from './components/content/content.svelte';
	import CardButtons
		from 'src/view/components/container/column/components/group/components/card/components/card-buttons/card-buttons.svelte';

	export let node: ColumnNode;
    export let editing: boolean;
    export let active: ActiveStatus | null;
    export let hasChildren: boolean;
    export let parentId: string;
</script>

<Droppable {active} {editing} {hasChildren} nodeId={node.id} {parentId}>
    {#if editing}
        <TextArea {node} {editing} />
    {:else}
        <Draggable nodeId={node.id}>
            <Content {node} />
        </Draggable>
    {/if}
    <CardButtons {active} {editing} />
</Droppable>



