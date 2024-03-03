import { Columns, NodeId } from 'src/stores/document/document-type';

export type StringSet = Set<string>;
export const traverseDown = (
    childGroups: NodeId[],
    columns: Columns,
    nodeId: NodeId,
    columnIndex = 0,
) => {
    for (let i = columnIndex; i < columns.length; i++) {
        const column = columns[i];
        for (const group of column.groups) {
            if (group.parentId === nodeId) {
                if (!nodeId.startsWith('-r')) childGroups.push(nodeId);
                for (const childNodeId of group.nodes) {
                    traverseDown(
                        childGroups,
                        columns,
                        childNodeId,
                        columnIndex + 1,
                    );
                }
            }
        }
    }
};
