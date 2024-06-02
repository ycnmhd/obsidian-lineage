import {
    ClipboardBranch,
    Column,
} from 'src/stores/document/document-state-type';
import { columnsToJson } from 'src/lib/data-conversion/columns-to-json';
import { jsonToSections } from 'src/lib/data-conversion/json-to-sections';
import { createColumn } from 'src/lib/tree-utils/create/create-column';
import { createGroup } from 'src/lib/tree-utils/create/create-group';

export const branchToSection = (branch: ClipboardBranch) => {
    const columns: Column[] = [];
    columns.push(createColumn());
    columns[columns.length - 1].groups.push(createGroup('root'));
    columns[columns.length - 1].groups[0].nodes.push(branch.nodeId);
    for (const groups of branch.sortedChildGroups) {
        columns.push(createColumn());
        for (const group of groups) {
            columns[columns.length - 1].groups.push(group);
        }
    }

    return jsonToSections(columnsToJson(columns, branch.content));
};
