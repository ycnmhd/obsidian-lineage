import { TFile } from 'obsidian';
import { createNewFile } from 'src/obsidian/commands/helpers/create-new-file';
import Lineage from 'src/main';
import { openFile } from 'src/obsidian/commands/helpers/open-file';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import { prepareExportedDocument } from 'src/obsidian/commands/helpers/export-document/prepare-exported-document';

export type ExportMode = 'markdown' | 'outline';
export const exportDocument = async (
    plugin: Lineage,
    file: TFile,
    mode: ExportMode,
) => {
    try {
        if (!file.parent) return;
        const fileData = await plugin.app.vault.read(file);
        const output = prepareExportedDocument(fileData, file.basename, mode);
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
