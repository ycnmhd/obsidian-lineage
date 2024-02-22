import { TreeNode } from 'src/view/store/helpers/conversion/columns-to-json/columns-to-json-tree';
import { Column, ColumnNode, NodeGroup } from 'src/view/store/document-reducer';
import { createColumn, createGroup } from 'src/view/store/helpers/create-node';
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
    level = 0,
) => {
    for (const treeNode of tree) {
        const node: ColumnNode = {
            id: id.node(),
            content: treeNode.content,
            parentId,
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
            jsonTreeToColumns(treeNode.children, node.id, columns, level + 1);
        }
    }
    return columns;
};
