import { Column, Content, NodeId } from 'src/stores/document/document-type';
import { traverseDown } from 'src/stores/document/helpers/search/traverse-down';
import { deleteGroupsByParentId } from 'src/stores/document/reducers/structure/delete-node/helpers/delete-groups-by-parent-id';
import { deleteNodeById } from 'src/stores/document/reducers/structure/delete-node/helpers/delete-node-by-id';

export const deleteBranch = (
    columns: Column[],
    content: Content,
    node: string,
) => {
    const childGroups: NodeId[] = [];
    traverseDown(childGroups, new Set<string>(), columns, node);
    if (childGroups.length > 0)
        deleteGroupsByParentId(columns, content, new Set(childGroups));
    deleteNodeById(columns, content, node);
};
