import { ColumnNode, Columns } from 'src/stores/document/document-reducer';

export type StringSet = Set<string>;
export const traverseDown = (
    childGroups: StringSet,
    childNodes: StringSet,
    columns: Columns,
    node: ColumnNode,
) => {
    for (const column of columns) {
        for (const group of column.groups) {
            if (group.parentId === node.id) {
                childGroups.add(group.id);
                for (const node of group.nodes) {
                    childNodes.add(node.id);
                    traverseDown(childGroups, childNodes, columns, node);
                }
            }
        }
    }
};
