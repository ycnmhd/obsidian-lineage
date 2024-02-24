<script lang="ts">
	import { Snapshot } from 'src/features/file-histoy/file-history-reducer';
	import { fileHistoryStore } from 'src/features/file-histoy/file-history-store';
	import { relativeTime } from 'src/helpers/relative-time';

	export let snapshot: Snapshot;
    export let active: boolean;
    export let filePath: string;
    const actionTypeStrings: Record<string, string> = {
        SET_NODE_CONTENT: 'Updated a node',
        CREATE_FIRST_NODE: 'Created a node',
        CREATE_NODE: 'Created a node',
        DROP_NODE: 'Moved a node',
        APPLY_SNAPSHOT: 'Applied a snapshot',
        INITIAL_DOCUMENT: 'Initial document',
    };
    const label = snapshot.actionType
        ? actionTypeStrings[snapshot.actionType] || snapshot.actionType
        : 'snapshot';
</script>

<div
    class="snapshot"
    class:selected={active}
    on:click={() =>
        fileHistoryStore.dispatch({
            type: 'SELECT_SNAPSHOT',
            payload: { snapshotId: snapshot.id, path: filePath },
        })}
>
    <div>
        {label}
    </div>
    <div class="time" data-created={snapshot.created}>
        {relativeTime(snapshot.created)}
    </div>
</div>

<style>
    .snapshot {
        padding: 5px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 4px;
    }
    .label {
        font-size: 16px;
        color: var(--color-base-60);
    }
    .selected {
        background-color: var(--nav-item-background-selected);
    }
    .time {
        font-size: 12px;
        color: var(--color-base-40);
    }
</style>
