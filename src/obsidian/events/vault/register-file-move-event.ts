import { TFile } from 'obsidian';
import Lineage from 'src/main';
import { fileViewTypeCache } from 'src/obsidian/patches/set-view-state';
import { updatePath } from 'src/view/helpers/stores-cache';

export const registerFileRenameEvent = (plugin: Lineage) => {
    plugin.registerEvent(
        plugin.app.vault.on('rename', (file, oldPath) => {
            if (file instanceof TFile) {
                if (fileViewTypeCache[oldPath]) {
                    updatePath(oldPath, file.path);
                    plugin.settings.dispatch({
                        type: 'HISTORY/UPDATE_DOCUMENT_PATH',
                        payload: {
                            newPath: file.path,
                            oldPath,
                        },
                    });
                }
            }
        }),
    );
};
