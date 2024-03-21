import { findNodeColumn } from '../../../../view/helpers/find-node-column';
import { Columns, NodeId } from 'src/stores/document/document-state-type';
import { id } from 'src/helpers/id';
import { sortGroups } from 'src/stores/document/reducers/move-node/helpers/sort-groups';

export const insertChild = (
    columns: Columns,
    nodeIdOfParent: string,
    newNodeId: string,
) => {
    const parentColumnIndex = findNodeColumn(columns, nodeIdOfParent);
    let createdNode: NodeId | null = null;
    if (parentColumnIndex === -1) {
        throw new Error('could not find parent column');
    }
    const childColumnIndex = parentColumnIndex + 1;
    createdNode = newNodeId;

    if (columns[childColumnIndex]) {
        const childColumn = columns[childColumnIndex];
        const childGroup = childColumn.groups.find(
            (g) => g.parentId === nodeIdOfParent,
        );
        if (childGroup) {
            childGroup.nodes.push(createdNode);
        } else {
            childColumn.groups.push({
                nodes: [createdNode],
                parentId: nodeIdOfParent,
            });
        }
        childColumn.groups = sortGroups(
            columns[parentColumnIndex].groups,
            childColumn.groups,
        );
    } else {
        columns.push({
            id: id.column(),
            groups: [
                {
                    nodes: [createdNode],
                    parentId: nodeIdOfParent,
                },
            ],
        });
    }
};
