import { Notice, TFile } from 'obsidian';
import { createNewFile } from 'src/obsidian/commands/helpers/create-new-file';
import Lineage from 'src/main';
import { openFile } from 'src/obsidian/commands/helpers/open-file';
import { onPluginError } from 'src/helpers/store/on-plugin-error';
import { markdownToJson } from 'src/stores/view/helpers/json-to-md/markdown-to-json/markdown-to-json';
import { treeToOutline } from 'src/obsidian/commands/helpers/export-document/helpers/tree-to-outline';
import { treeToMarkdown } from 'src/obsidian/commands/helpers/export-document/helpers/tree-to-markdown';

export const exportDocument = async (
    plugin: Lineage,
    file: TFile,
    mode: 'markdown' | 'outline',
) => {
    try {
        if (!file.parent) return;
        const data = await plugin.app.vault.read(file);
        const tree = markdownToJson(data);
        if (tree.length < 2 && tree[0].children.length == 0) {
            const message = `File ${file.basename} does not appear to be a tree`;
            new Notice(message);
            return;
        }
        const output =
            mode === 'outline' ? treeToOutline(tree) : treeToMarkdown(tree);
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
