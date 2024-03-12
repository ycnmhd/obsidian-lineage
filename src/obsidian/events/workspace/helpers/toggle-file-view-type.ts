import Lineage from 'src/main';
import { TFile, WorkspaceLeaf } from 'obsidian';
import { fileViewTypeCache } from 'src/obsidian/patches/set-view-state';
import { setFileViewType } from 'src/obsidian/events/workspace/helpers/set-file-view-type';
import { getLeafOfFile } from 'src/obsidian/events/workspace/helpers/get-leaf-of-file';
import { openFile } from 'src/obsidian/commands/helpers/open-file';

export const toggleFileViewType = (
    plugin: Lineage,
    file: TFile,
    leaf: WorkspaceLeaf | undefined,
) => {
    const currentModeIsLineage = fileViewTypeCache[file.path];
    const currentViewType = currentModeIsLineage ? 'lineage' : 'markdown';
    const newViewType = currentModeIsLineage ? 'markdown' : 'lineage';

    const fileLeaf = leaf || getLeafOfFile(plugin, file, currentViewType);
    setFileViewType(plugin, file, fileLeaf, newViewType);
    if (!fileLeaf) openFile(plugin, file, 'tab', newViewType);
};
