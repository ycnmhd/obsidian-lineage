import LabeledAnnotations from '../../main';
import { TFile } from 'obsidian';
import { fileTypeCache } from 'src/patches/set-view-state';

export const registerFileDeleteEvent = (plugin: LabeledAnnotations) => {
    plugin.registerEvent(
        plugin.app.vault.on('delete', (file) => {
            if (file instanceof TFile) {
                if (fileTypeCache[file.path])
                    plugin.settings.dispatch({
                        type: 'SET_DOCUMENT_TYPE_TO_MARKDOWN',
                        payload: {
                            path: file.path,
                        },
                    });
            }
        }),
    );
};
