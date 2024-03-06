import { Column, Content, NodeId } from 'src/stores/view/view-state-type';
import { traverseDown } from 'src/stores/view/helpers/search/traverse-down';
import { deleteGroupsByParentId } from 'src/stores/view/reducers/document/structure/delete-node/helpers/delete-groups-by-parent-id';
import { deleteNodeById } from 'src/stores/view/reducers/document/structure/delete-node/helpers/delete-node-by-id';

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
