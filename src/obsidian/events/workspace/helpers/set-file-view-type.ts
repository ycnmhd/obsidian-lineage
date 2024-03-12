import Lineage from 'src/main';
import { TFile, ViewState, WorkspaceLeaf } from 'obsidian';
import { FILE_VIEW_TYPE } from 'src/view/view';

export const setFileViewType = (
    plugin: Lineage,
    file: TFile,
    leaf: WorkspaceLeaf | undefined,
    newViewType: 'markdown' | typeof FILE_VIEW_TYPE,
) => {
    plugin.settings.dispatch({
        type:
            newViewType === 'markdown'
                ? 'SET_DOCUMENT_TYPE_TO_MARKDOWN'
                : 'SET_DOCUMENT_TYPE_TO_TREE',
        payload: {
            path: file.path,
        },
    });

    if (leaf) {
        setTimeout(() => {
            leaf.setViewState({
                type: newViewType,
                popstate: true,
                state: leaf.view.getState(),
            } as ViewState);
            plugin.app.workspace.revealLeaf(leaf);
        }, 0);
    }
};
