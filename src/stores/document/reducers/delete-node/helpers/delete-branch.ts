import {
    Column,
    Content,
    NodeId,
} from 'src/stores/document/document-state-type';
import { traverseDown } from 'src/stores/view/helpers/search/traverse-down';
import { deleteGroupsByParentId } from 'src/stores/document/reducers/delete-node/helpers/delete-groups-by-parent-id';
import { deleteNodeById } from 'src/stores/document/reducers/delete-node/helpers/delete-node-by-id';

export const deleteBranch = (
    columns: Column[],
    content: Content,
    node: string,
) => {
    const childGroups: NodeId[] = [];
    traverseDown(childGroups, columns, node);
    if (childGroups.length > 0)
        deleteGroupsByParentId(columns, content, new Set(childGroups));
    deleteNodeById(columns, content, node);
};
