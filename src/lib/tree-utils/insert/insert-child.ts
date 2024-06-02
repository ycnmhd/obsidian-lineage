import { findNodeColumn } from '../find/find-node-column';
import {
    LineageDocument,
    NodeId,
} from 'src/stores/document/document-state-type';
import { id } from 'src/helpers/id';
import { sortGroups } from 'src/lib/tree-utils/sort/sort-groups';

export const insertChild = (
    document: Pick<LineageDocument, 'columns'>,
    nodeIdOfParent: string,
    newNodeId: string,
) => {
    const parentColumnIndex = findNodeColumn(document.columns, nodeIdOfParent);
    let createdNode: NodeId | null = null;
    if (parentColumnIndex === -1) {
        throw new Error('could not find parent column');
    }
    const childColumnIndex = parentColumnIndex + 1;
    createdNode = newNodeId;

    if (document.columns[childColumnIndex]) {
        const childColumn = document.columns[childColumnIndex];
        const childGroup = childColumn.groups.find(
            (g) => g.parentId === nodeIdOfParent,
        );
        if (childGroup) {
            childGroup.nodes.push(createdNode);
            childGroup.nodes = [...childGroup.nodes];
        } else {
            childColumn.groups.push({
                nodes: [createdNode],
                parentId: nodeIdOfParent,
            });
            childColumn.groups = [...childColumn.groups];
        }
        childColumn.groups = sortGroups(
            document.columns[parentColumnIndex].groups,
            childColumn.groups,
        );
    } else {
        document.columns.push({
            id: id.column(),
            groups: [
                {
                    nodes: [createdNode],
                    parentId: nodeIdOfParent,
                },
            ],
        });
        document.columns = [...document.columns];
    }
};
