import { LineageView } from 'src/view/view';
import { getBranch } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-branch';
import { branchToSection } from 'src/lib/data-conversion/branch-to-section';
import { createNewFile } from 'src/obsidian/commands/helpers/create-new-file';
import invariant from 'tiny-invariant';
import { openFile } from 'src/obsidian/commands/helpers/open-file';
import { getFileNameOfExtractedBranch } from 'src/obsidian/commands/helpers/extract-branch/helpers/get-file-name-of-extracted-branch/get-file-name-of-extracted-branch';
import { onPluginError } from 'src/lib/store/on-plugin-error';

export const extractBranch = async (view: LineageView) => {
    try {
        invariant(view.file);
        invariant(view.file.parent);
        const viewState = view.viewStore.getValue();
        const documentState = view.documentStore.getValue();
        const branch = getBranch(
            documentState.document.columns,
            documentState.document.content,
            viewState.document.activeNode,
            'copy',
        );

        const text = branchToSection(branch);
        const newFile = await createNewFile(
            view.plugin,
            view.file.parent,
            text,
            getFileNameOfExtractedBranch(
                branch.content[branch.nodeId].content,
                view.file.basename,
                documentState.sections.id_section[branch.nodeId],
            ),
        );
        await openFile(view.plugin, newFile, 'split', 'lineage');
        view.documentStore.dispatch({
            type: 'DOCUMENT/EXTRACT_BRANCH',
            payload: {
                nodeId: branch.nodeId,
                documentName: newFile.basename,
            },
        });
    } catch (e) {
        onPluginError(e, 'command', { type: 'extract-branch' });
    }
};
