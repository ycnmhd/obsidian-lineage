import { ColumnNode, Columns } from 'src/stores/document/document-type';

export type StringSet = Set<string>;
export const traverseDown = (
    childGroups: StringSet,
    childNodes: StringSet,
    columns: Columns,
    nodeId: ColumnNode,
    columnIndex = 0,
) => {
    for (let i = columnIndex; i < columns.length; i++) {
        const column = columns[i];
        for (const group of column.groups) {
            if (group.parentId === nodeId) {
                if (!nodeId.startsWith('-r')) childGroups.add(nodeId);
                for (const childNodeId of group.nodes) {
                    childNodes.add(childNodeId);
                    traverseDown(
                        childGroups,
                        childNodes,
                        columns,
                        childNodeId,
                        columnIndex + 1,
                    );
                }
            }
        }
    }
};
