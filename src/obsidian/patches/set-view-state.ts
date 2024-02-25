import { ViewState } from 'obsidian';
import { TREE_VIEW_TYPE } from 'src/view/view';
import TreeEdit from 'src/main';
import { Settings } from 'src/stores/settings/settings-type';

export let fileTypeCache: Settings['documents'] = {};
export const subscribeDocumentsTypeCacheToSettings = (plugin: TreeEdit) => {
    plugin.settings.subscribe((v) => {
        fileTypeCache = v.documents;
    });
};

export function setViewState(next: () => unknown) {
    return function (state: ViewState, ...rest: unknown[]) {
        const isMarkdownView = state.type === 'markdown';

        const path = state?.state?.file;

        if (isMarkdownView && fileTypeCache[path]) {
            const newState = {
                ...state,
                type: TREE_VIEW_TYPE,
            };

            return next.apply(this, [newState, ...rest]);
        } else {
            return next.apply(this, [state, ...rest]);
        }
    };
}
