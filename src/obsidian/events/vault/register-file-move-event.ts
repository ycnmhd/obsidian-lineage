import { TFile } from 'obsidian';
import TreeEdit from 'src/main';
import { fileTypeCache } from 'src/obsidian/patches/set-view-state';

export const registerFileRenameEvent = (plugin: TreeEdit) => {
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
