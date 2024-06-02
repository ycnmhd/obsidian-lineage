import { TreeNode } from 'src/lib/data-conversion/columns-to-json';
import {
    Column,
    Content,
    NodeGroup,
    NodeId,
} from 'src/stores/document/document-state-type';
import { id } from 'src/helpers/id';
import { createColumn } from 'src/lib/tree-utils/create/create-column';
import { createGroup } from 'src/lib/tree-utils/create/create-group';

const groupsCache: Record<string, NodeGroup | undefined> = {};
const findGroup = (column: Column, parentId: string) => {
    if (!groupsCache[parentId]) {
        groupsCache[parentId] = column.groups.find(
            (g) => g.parentId === parentId,
        );
    }
    return groupsCache[parentId];
};

export const jsonToColumns = (
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
            jsonToColumns(treeNode.children, node, columns, content, level + 1);
        }
    }
    return { content, columns };
};
