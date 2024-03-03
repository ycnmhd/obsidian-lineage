import { TreeNode } from 'src/stores/document/helpers/json-to-md/columns-to-json/columns-to-json-tree';
import {
    createColumn,
    createGroup,
} from 'src/stores/document/helpers/create-node';
import {
    Column,
    NodeId,
    Content,
    NodeGroup,
} from 'src/stores/document/document-type';
import { id } from 'src/helpers/id';

const groupsCache: Record<string, NodeGroup | undefined> = {};
const findGroup = (column: Column, parentId: string) => {
    if (!groupsCache[parentId]) {
        groupsCache[parentId] = column.groups.find(
            (g) => g.parentId === parentId,
        );
    }
    return groupsCache[parentId];
};

export const jsonTreeToColumns = (
    tree: TreeNode[],
    parentId = id.rootNode(),
    columns: Column[] = [],
    content: Content = {},
    level = 0,
) => {
    for (const treeNode of tree) {
        const node: NodeId = id.node();
        content[node] = {
            content: treeNode.content,
        };

        if (!columns[level]) {
            columns.push(createColumn());
        }
        const column = columns[level];
        let group: NodeGroup | undefined;
        group = findGroup(column, parentId);
        if (!group) {
            group = createGroup(parentId);
            column.groups.push(group);
        }
        group.nodes.push(node);
        if (treeNode.children.length > 0) {
            jsonTreeToColumns(
                treeNode.children,
                node,
                columns,
                content,
                level + 1,
            );
        }
    }
    return { content, columns };
};
