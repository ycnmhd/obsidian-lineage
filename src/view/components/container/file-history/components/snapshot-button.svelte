<script lang="ts">
	import { Snapshot } from 'src/stores/file-history/file-history-reducer';
	import { fileHistoryStore } from 'src/stores/file-history/file-history-store';
	import { relativeTime } from 'src/helpers/relative-time';
	import { FileQuestion } from 'lucide-svelte';
	import { actionInfo } from 'src/view/components/container/file-history/components/helpers/action-info';

	export let snapshot: Snapshot;
    export let active: boolean;
    export let reverseIndex: number;
    export let filePath: string;

    const icon: { icon: typeof FileQuestion; label: string } =
        snapshot.actionType && actionInfo[snapshot.actionType]
            ? actionInfo[snapshot.actionType]
            : {
                  label: 'unknown',
                  icon: FileQuestion,
              };
</script>

<div
    aria-label={icon.label}
    class="snapshot"
    class:selected={active}
    on:click={() =>
        fileHistoryStore.dispatch({
            type: 'SELECT_SNAPSHOT',
            payload: { snapshotId: snapshot.id, path: filePath },
        })}
>
    <svelte:component class="svg-icon label" this={icon.icon} />
    <span class="time" data-created={snapshot.created}>
        {relativeTime(snapshot.created)}
    </span>
    <span class="index">{reverseIndex}</span>
</div>

<style>
    .snapshot {
        padding: 8px 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        border-radius: 4px;
        gap: 8px;
    }
    .label {
        font-size: 14px;
        color: var(--color-base-70);
        display: block;
    }
    .index {
        font-size: 12px;
        color: var(--color-base-50);
        min-width: 16px;
        text-align: left;
		margin-left: auto;
    }

    .selected {
        background-color: var(--nav-item-background-selected);
    }
    .time {
        font-size: 12px;
        color: var(--color-base-60);
    }
</style>
