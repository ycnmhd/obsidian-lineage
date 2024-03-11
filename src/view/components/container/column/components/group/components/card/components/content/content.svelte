<script lang="ts">
    import { getPlugin, getStore } from 'src/view/components/container/context';
    import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
    import {
        markdownPreviewAction
    } from 'src/view/components/container/column/components/group/components/card/components/content/actions/markdown-preview-action';

    export let active: ActiveStatus | null;

    export let content: string;
    // eslint-disable-next-line no-undef


	const plugin = getPlugin();
	const store = getStore();
    // eslint-disable-next-line no-undef
    const onClick = (e: MouseEvent) => {
        // eslint-disable-next-line no-undef
        if (e.target instanceof HTMLAnchorElement) {
            if (e.target.hasClass('internal-link')) {
                const link = e.target.dataset.href;
                const path = store.getValue().file.path;
                if (link && path) {
                    plugin.app.workspace.openLinkText(link, path, true);
                }
            }
        }
    };
    const classes: Record<ActiveStatus, string> = {
        [ActiveStatus.node]: 'active',
        [ActiveStatus.parent]: 'parent',
        [ActiveStatus.sibling]: 'parent',
        [ActiveStatus.child]: 'active',
    };
</script>

<div
    class={'lineage__card content markdown-preview-view ' + (active?classes[active]:'')}
    data-active={active||"inactive"}
    on:click={onClick}
	use:markdownPreviewAction={content}
></div>

<style>
    .content {
        width: 100%;
        min-height: 100px;
        padding: 6px;
        font-size: 16px;
		padding-left: 12px
    }
    .active {
        color: var(--color-active-node);
    }
    .parent {
        color: var(--color-active-child);
    }


</style>
