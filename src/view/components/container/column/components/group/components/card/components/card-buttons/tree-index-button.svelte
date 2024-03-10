<script lang="ts">
    import { getPlugin, getStore, getView } from '../../../../../../../context';
    import { ActiveStatus } from 'src/view/components/container/column/components/group/components/active-status.enum';
    import { parseDelimiter } from 'src/stores/view/helpers/json-to-md/markdown-to-json/helpers/delimiter';
    import { get } from 'svelte/store';
    import { MarkdownView, TFile } from 'obsidian';

    const plugin = getPlugin();
    const store = getStore();
    const view = getView();
    export let nodeId: string;
    export let activeStatus: ActiveStatus | null;
    
    const openFileAndJumpToLine = async (file: TFile, line: number) => {
        const leaf = plugin.app.workspace.getLeaf('split');
        plugin.settings.dispatch({
            type: 'SET_DOCUMENT_TYPE_TO_MARKDOWN',
            payload: { path: file.path },
        });
        await leaf.openFile(file);
        const markdownView = leaf.view as MarkdownView;
        markdownView.editor.setCursor({ line, ch: 0 });
        plugin.settings.dispatch({
            type: 'SET_DOCUMENT_TYPE_TO_TREE',
            payload: { path: file.path },
        });
    };
    // eslint-disable-next-line no-undef
    const openFile = async (e: MouseEvent) => {
        if (!view.file) return;
        const treeIndex = get(store).ui.treeIndex[nodeId];
        const lines = view.data.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('<!--')) {
                const section = parseDelimiter(line);
                if (section && section[2] === treeIndex) {
                    await openFileAndJumpToLine(view.file, i + 1);
                }
            }
        }
    };
    const classes: Partial<Record<ActiveStatus, string>> = {
        [ActiveStatus.node]: 'is-active',
        [ActiveStatus.child]: 'is-active-child',
        [ActiveStatus.parent]: 'is-active-parent',
        [ActiveStatus.sibling]: 'is-active-parent',
    };
</script>

<div
    class={'tree-index ' + (activeStatus ? classes[activeStatus] : '')}
    on:click={openFile}
>
    {$store.ui.treeIndex[nodeId]}
</div>

<style>
    .tree-index {
        position: absolute;
        bottom: 3px;
        right: 8px;
        opacity: 0.8;
        font-size: 12px;
        cursor: pointer;
    }
    .is-active {
        opacity: 0.3;
    }

    .is-active-child {
        opacity: 0.3;
    }

    .is-active-parent {
        opacity: 0.6;
    }
</style>
