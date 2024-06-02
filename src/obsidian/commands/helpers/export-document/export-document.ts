import { Notice, TFile } from 'obsidian';
import { createNewFile } from 'src/obsidian/commands/helpers/create-new-file';
import Lineage from 'src/main';
import { openFile } from 'src/obsidian/commands/helpers/open-file';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import { sectionsToJson } from 'src/lib/data-conversion/sections-to-json';
import { jsonToOutline } from 'src/lib/data-conversion/json-to-outline';
import { jsonToText } from 'src/lib/data-conversion/json-to-text';

export const exportDocument = async (
    plugin: Lineage,
    file: TFile,
    mode: 'markdown' | 'outline',
) => {
    try {
        if (!file.parent) return;
        const data = await plugin.app.vault.read(file);
        const tree = sectionsToJson(data);
        if (tree.length < 2 && tree[0].children.length == 0) {
            const message = `File ${file.basename} does not appear to be a tree`;
            new Notice(message);
            return;
        }
        const output =
            mode === 'outline' ? jsonToOutline(tree) : jsonToText(tree);
        const newFile = await createNewFile(
            plugin,
            file.parent,
            output,
            file.basename,
        );
        if (newFile) await openFile(plugin, newFile, 'split', 'markdown');
    } catch (e) {
        onPluginError(e, 'command', { type: 'export-document' });
    }
};
