<script lang="ts">
	import { ColumnNode } from 'src/stores/document/document-reducer';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
	import CardButtons from './components/card-buttons/card-buttons.svelte';
	import Draggable from './components/dnd/draggable.svelte';
	import Droppable from './components/dnd/droppable.svelte';
	import TextArea from './components/content/textarea.svelte';
	import Content from './components/content/content.svelte';

	export let node: ColumnNode;
    export let editing: boolean;
    export let active: ActiveStatus | null;

</script>

<Droppable
   active={active}
    nodeId={node.id}
>
    {#if editing}
        <TextArea {node} {editing} />
    {:else}
        <Draggable nodeId={node.id}>
            <Content {node} />
        </Draggable>
    {/if}
    <CardButtons {active} {editing} />
</Droppable>



