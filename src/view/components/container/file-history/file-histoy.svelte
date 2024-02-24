<script lang="ts">
	import { FileHistory } from 'src/features/file-histoy/file-history-reducer';
	import SnapshotButton from './components/snapshot-button.svelte';
	import { updateRelativeTime } from 'src/view/components/container/file-history/actions/update-relative-time';

	export let fileHistory: FileHistory;
    export let path: string;
</script>

<div class="sidebar">
    <div class="snapshots-list" use:updateRelativeTime>
        {#each [...fileHistory.snapshots].sort((a, b) => b.created - a.created) as snapshot (snapshot.id)}
            <SnapshotButton
                {snapshot}
                active={fileHistory.activeSnapshotId === snapshot.id}
                filePath={path}
            />
        {/each}
    </div>
</div>

<style>
    .sidebar {
        width: 250px;
        height: fit-content;
        background-color: var(--background-secondary);
        position: absolute;
        right: var(--sidebar-right);
        top: var(--size-4-2);
        padding: var(--size-4-2);
    }

    .snapshots-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
        max-height: 200px;
        overflow-y: auto;
    }
</style>
