<script lang="ts">
    import { relativeTime } from 'src/helpers/relative-time';
    import { FileQuestion } from 'lucide-svelte';
    import { actionInfo } from 'src/view/components/container/file-history/components/helpers/action-info';
    import { Snapshot } from 'src/stores/document/document-state-type';
    import { getView } from 'src/view/components/container/context';
    import { Notice } from 'obsidian';

    export let snapshot: Snapshot;
    export let active: boolean;
    export let reverseIndex: number;
    export let filePath: string;

    const view = getView();
    const documentStore = view.documentStore;
    const viewStore = view.viewStore;
    const icon = (
        actionInfo[snapshot.action.type]
            ? actionInfo[snapshot.action.type]
            : {
                  label: snapshot.action.type || 'unknown',
                  icon: FileQuestion,
              }
    ) as { icon: typeof FileQuestion; label: string };
</script>

<div
    aria-label={icon.label}
    class="snapshot"
    class:selected={active}
    on:click={() => {
        if (viewStore.getValue().document.editing.activeNodeId)
            new Notice('cannot apply snapshot while editing');
        else
            documentStore.dispatch({
                type: 'HISTORY/SELECT_SNAPSHOT',
                payload: { snapshotId: snapshot.id, path: filePath },
            });

    }}
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
