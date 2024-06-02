import { sectionsToJson } from 'src/lib/data-conversion/sections-to-json';
import { jsonToColumns } from 'src/lib/data-conversion/json-to-columns';
import { ClipboardBranch } from 'src/stores/document/document-state-type';
import { getBranch } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-branch';

export const textToBranches = (text: string) => {
    const tree = sectionsToJson(text);
    const document = jsonToColumns(tree);

    const branches: ClipboardBranch[] = [];
    for (const nodeId of document.columns[0].groups[0].nodes) {
        const branch = getBranch(
            document.columns,
            document.content,
            nodeId,
            'copy',
        );
        branches.push(branch);
    }

    return branches;
};
