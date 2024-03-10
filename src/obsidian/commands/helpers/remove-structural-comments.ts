import { Notice, TFile } from 'obsidian';
import { parseDelimiter } from 'src/stores/view/helpers/json-to-md/markdown-to-json/helpers/delimiter';
import { createNewFile } from 'src/obsidian/commands/helpers/create-new-file';
import Lineage from 'src/main';
import { openFile } from 'src/obsidian/commands/helpers/open-file';

export const removeStructuralComments = async (
    plugin: Lineage,
    file: TFile,
) => {
    if (!file.parent) return;
    const data = await plugin.app.vault.read(file);
    const lines = data.split('\n');
    const newLines: string[] = [];
    for (const line of lines) {
        if (parseDelimiter(line)) continue;
        newLines.push(line);
    }
    if (newLines.length < lines.length) {
        const newFile = await createNewFile(
            plugin,
            file.parent,
            newLines.join('\n'),
            file.basename,
        );
        if (newFile) await openFile(plugin, newFile, 'split');
    } else {
        new Notice(`File ${file.basename} does not have structural comments`);
    }
};
