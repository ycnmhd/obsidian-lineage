<script lang="ts">
    import { NodeId } from 'src/stores/document/document-state-type';
    import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
    import Draggable from './components/dnd/draggable.svelte';
    import Droppable from './components/dnd/droppable.svelte';
    import TextArea from './components/content/textarea.svelte';
    import Content from './components/content/content.svelte';
    import CardButtons
        from 'src/view/components/container/column/components/group/components/card/components/card-buttons/card-buttons.svelte';
    import { getView } from 'src/view/components/container/context';

    export let node: NodeId;
    export let editing: boolean;
    export let active: ActiveStatus | null;
    export let hasChildren: boolean;
    export let parentId: string;
    const view = getView()
    const store = view.documentStore

</script>

<Droppable {active} {editing} {hasChildren} nodeId={node} {parentId}>
    {#if active===ActiveStatus.node && editing}
        <TextArea {node} {editing} />
    {:else}
        <Draggable nodeId={node}>
            <Content {active} content={$store.document.content[node]?.content || ''} />
        </Draggable>
    {/if}
    <CardButtons {active} {editing} nodeId={node}/>
</Droppable>



