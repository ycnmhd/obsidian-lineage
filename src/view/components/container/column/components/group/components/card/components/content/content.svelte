<script lang="ts">
	import { getPlugin, getView } from 'src/view/components/container/context';
	import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
	import { markdownPreviewAction } from 'src/view/actions/markdown-preview-action';

	export let active: ActiveStatus | null;

    export let content: string;

	const plugin = getPlugin();
	const view = getView()
	const store = view.documentStore
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
</script>

<div
    class={'preview-container markdown-preview-view'}
    on:click={onClick}
	use:markdownPreviewAction={content}
></div>

<style>
    .preview-container {
        width: 100%;
        min-height: 100px;
		font-size: var(--font-text-size);
		padding: 6px 6px 6px 12px;
		color-scheme: light
    }
</style>
