import { TFile } from 'obsidian';
import Lineage from 'src/main';
import { toggleFileViewType } from 'src/obsidian/events/workspace/helpers/toggle-file-view-type';

export const openFile = async (
    plugin: Lineage,
    file: TFile,
    newLeaf?: 'split' | 'tab',
    mode?: 'lineage',
) => {
    const leaf = plugin.app.workspace.getLeaf(newLeaf);
    await leaf.openFile(file);
    if (mode === 'lineage') {
        toggleFileViewType(plugin, file, leaf);
    }
};
