<script lang="ts">
	import { MarkdownRenderer } from 'obsidian';
	import { getPlugin, getStore, getView } from 'src/view/components/container/context';
	import { onMount } from 'svelte';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';

	export let active: ActiveStatus

	export let content: string;
    // eslint-disable-next-line no-undef
    let targetEl: HTMLDivElement | undefined = undefined;
    const plugin = getPlugin();
    const store = getStore();
    const view = getView();
    onMount(() => {
        const state = store.getValue();
        if (view && targetEl) {
            MarkdownRenderer.render(
                plugin.app,
                content,
                targetEl,
                state.file.path as string,
                view,
            );
        }
    });

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
	const classes : Record<ActiveStatus,string> = {
		[ActiveStatus.node]:"active",
		[ActiveStatus.parent]:"parent",
		[ActiveStatus.sibling]:"parent",
		[ActiveStatus.child]:"active"
	}
</script>

<div
    bind:this={targetEl}
    class={"content markdown-preview-view "+(classes[active])}
    on:click={onClick}
>
</div>

<style>
    .content {
        width: 100%;
        min-height: 100px;
        padding: 6px;
        font-size: 16px;
    }
	.active {
		color: var(--color-active-node);
	}
	.parent {
		color: var(--color-active-child);
	}


</style>
