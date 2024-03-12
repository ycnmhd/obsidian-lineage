import { TFile } from 'obsidian';
import Lineage from 'src/main';
import { setFileViewType } from 'src/obsidian/events/workspace/helpers/set-file-view-type';
import { FILE_VIEW_TYPE } from 'src/view/view';

export const openFile = async (
    plugin: Lineage,
    file: TFile,
    newLeaf: 'split' | 'tab',
    mode: 'markdown' | typeof FILE_VIEW_TYPE,
) => {
    const leaf = plugin.app.workspace.getLeaf(newLeaf);
    await leaf.openFile(file);
    setFileViewType(plugin, file, leaf, mode);
};
