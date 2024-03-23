import { ViewState } from 'obsidian';
import { FILE_VIEW_TYPE } from 'src/view/view';
import Lineage from 'src/main';
import { Settings } from 'src/stores/settings/settings-type';

export let fileViewTypeCache: Settings['documents'] = {};
export const subscribeDocumentsTypeCacheToSettings = (plugin: Lineage) => {
    plugin.settings.subscribe((v) => {
        fileViewTypeCache = v.documents;
    });
};

export function setViewState(next: () => unknown) {
    return function (state: ViewState, ...rest: unknown[]) {
        const isMarkdownView = state.type === 'markdown';

        const path = state?.state?.file;
        if (
            isMarkdownView &&
            fileViewTypeCache[path] &&
            !state.state.inlineEditor
        ) {
            const newState = {
                ...state,
                type: FILE_VIEW_TYPE,
            };

            return next.apply(this, [newState, ...rest]);
        } else {
            return next.apply(this, [state, ...rest]);
        }
    };
}
