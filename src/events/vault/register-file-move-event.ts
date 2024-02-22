import LabeledAnnotations from '../../main';
import { TFile } from 'obsidian';
import { fileTypeCache } from 'src/patches/set-view-state';

export const registerFileRenameEvent = (plugin: LabeledAnnotations) => {
    plugin.registerEvent(
        plugin.app.vault.on('rename', (file, oldPath) => {
            if (file instanceof TFile) {
                if (fileTypeCache[oldPath])
                    plugin.settings.dispatch({
                        type: 'SET_DOCUMENT_PATH',
                        payload: {
                            newPath: file.path,
                            oldPath,
                        },
                    });
            }
        }),
    );
};
