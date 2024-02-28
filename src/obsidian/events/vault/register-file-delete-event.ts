import LabeledAnnotations from '../../../main';
import { TFile } from 'obsidian';
import { fileViewTypeCache } from 'src/obsidian/patches/set-view-state';
import { deletePath } from 'src/view/helpers/stores-cache';
import { fileHistoryStore } from 'src/stores/file-history/file-history-store';

export const registerFileDeleteEvent = (plugin: LabeledAnnotations) => {
    plugin.registerEvent(
        plugin.app.vault.on('delete', (file) => {
            if (file instanceof TFile) {
                if (fileViewTypeCache[file.path]) {
                    deletePath(file.path);
                    fileHistoryStore.dispatch({
                        type: 'DELETE_DOCUMENT',
                        payload: {
                            path: file.path,
                        },
                    });
                    plugin.settings.dispatch({
                        type: 'SET_DOCUMENT_TYPE_TO_MARKDOWN',
                        payload: {
                            path: file.path,
                        },
                    });
                }
            }
        }),
    );
};
