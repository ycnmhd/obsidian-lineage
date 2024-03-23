<script lang="ts">
    import SnapshotButton from './components/snapshot-button.svelte';
    import { updateRelativeTime } from 'src/view/actions/update-relative-time';
    import { DocumentHistory } from 'src/stores/document/document-state-type';

    export let documentHistory: DocumentHistory;
    export let path: string;
</script>

<div class="sidebar">
    <div
        class="snapshots-list"
        use:updateRelativeTime
    >
        {#each [...documentHistory.items].sort((a, b) => b.created - a.created) as snapshot, index (snapshot.id)}
            <SnapshotButton
                {snapshot}
                active={documentHistory.items.length - index - 1 ===
                    documentHistory.state.activeIndex}
                filePath={path}
                reverseIndex={documentHistory.items.length - index}
            />
        {/each}
    </div>
</div>

<style>
    .sidebar {
        min-width: 165px;
		width: fit-content;
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
