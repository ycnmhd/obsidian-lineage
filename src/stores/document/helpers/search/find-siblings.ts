import { ColumnNode, Columns } from 'src/stores/document/document-reducer';

import { StringSet } from 'src/stores/document/helpers/search/traverse-down';

export const findSiblings = (
    siblingNodes: StringSet,
    columns: Columns,
    node: ColumnNode,
) => {
    for (const column of columns) {
        for (const group of column.groups) {
            if (group.parentId === node.parentId) {
                for (const groupNode of group.nodes) {
                    if (groupNode.id !== node.id)
                        siblingNodes.add(groupNode.id);
                }
            }
        }
    }
};
