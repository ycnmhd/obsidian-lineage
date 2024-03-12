import Lineage from 'src/main';
import { TFile, TFolder } from 'obsidian';

const getUniqueFileName = (
    folderPath: string,
    files: string[],
    basename = 'Untitled',
): string => {
    let index = 1;
    let newFileName = basename;

    while (files.includes(`${newFileName}`)) {
        newFileName = `${basename} (${index})`;
        index++;
    }

    return `${folderPath}/${newFileName}`;
};

export const createNewFile = async (
    plugin: Lineage,
    folder: TFolder,
    data = '',
    basename?: string,
) => {
    if (folder) {
        const children = folder.children
            .map((c) => (c instanceof TFile ? c.basename : null))
            .filter((f) => f) as string[];
        const path = getUniqueFileName(folder.path, children, basename);
        const newFilePath = path + '.md';

        return await plugin.app.vault.create(newFilePath, data);
    }
};
