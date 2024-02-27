import Lineage from 'src/main';
import { TFile, TFolder } from 'obsidian';
import { toggleFileViewType } from 'src/obsidian/events/workspace/helpers/toggle-file-view-type';

const getUniqueFileName = (folderPath: string, files: string[]): string => {
    let index = 1;
    let newFileName = `Untitled`;

    while (files.includes(`${newFileName}`)) {
        newFileName = `Untitled (${index})`;
        index++;
    }

    return `${folderPath}/${newFileName}`;
};

export const createNewFile = async (plugin: Lineage, folder: TFolder) => {
    if (folder) {
        const children = folder.children
            .map((c) => (c instanceof TFile ? c.basename : null))
            .filter((f) => f) as string[];
        const path = getUniqueFileName(folder.path, children);
        const newFilePath = path + '.md';

        const file = await plugin.app.vault.create(newFilePath, '');
        const leaf = plugin.app.workspace.getLeaf();
        await leaf.openFile(file);
        toggleFileViewType(plugin, file, leaf);
    }
};
