import Lineage from 'src/main';
import { MarkdownView, TFile, ViewState, WorkspaceLeaf } from 'obsidian';
import { fileViewTypeCache } from 'src/obsidian/patches/set-view-state';
import { FILE_VIEW_TYPE } from 'src/view/view';

export const toggleFileViewType = (
    plugin: Lineage,
    file: TFile,
    leaf: WorkspaceLeaf | undefined,
) => {
    const isTree = fileViewTypeCache[file.path];
    plugin.settings.dispatch({
        type: isTree
            ? 'SET_DOCUMENT_TYPE_TO_MARKDOWN'
            : 'SET_DOCUMENT_TYPE_TO_TREE',
        payload: {
            path: file.path,
        },
    });

    if (!leaf) {
        const leaves = plugin.app.workspace.getLeavesOfType(
            isTree ? FILE_VIEW_TYPE : 'markdown',
        );
        leaf = leaves.find(
            (l) => (l.view as MarkdownView)?.file?.path === file.path,
        );
    }
    setTimeout(() => {
        if (leaf) {
            leaf.setViewState({
                type: isTree ? 'markdown' : FILE_VIEW_TYPE,
                popstate: true,
                state: leaf.view.getState(),
            } as ViewState);
        }
    }, 0);
};
