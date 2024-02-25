import { Column, ColumnNode, NodeGroup } from 'src/view/store/document-reducer';
import { id } from 'src/helpers/id';
import { findGroup } from 'src/view/store/helpers/find-branch';
import { TreeNode } from 'src/view/store/helpers/conversion/columns-to-json/columns-to-json-tree';
import { createNode } from 'src/view/store/helpers/create-node';
import { expect } from 'vitest';

export const __group__ = (parentId: string, __id__?: string): NodeGroup => ({
    id: __id__ || id.group(),
    parentId,
    nodes: [],
});
export const __column__ = (...parentIds: string[]): Column => ({
    id: id.column(),
    groups: parentIds ? parentIds.map((parentId) => __group__(parentId)) : [],
});
export const __populateColumn__ = (column: Column, ...nodes: ColumnNode[]) => {
    for (const node of nodes) {
        const group = findGroup([column], node);
        if (group) {
            group.nodes.push(node);
        } else {
            throw new Error(
                `could not find a group for parentId ${node.parentId}`,
            );
        }
    }
};

export const __treeNode__ = (
    parent: ColumnNode,
    ...children: ColumnNode[]
): TreeNode => {
    return {
        content: parent.content,
        children: children.map((child) => __treeNode__(child)),
    };
};

export const __populateNode__ = (node: ColumnNode, number: number) => {
    return Array.from({ length: number }).map((_, i) => {
        return createNode(node.id, undefined, 'node ' + i);
    });
};

export const __compareColumns__ = (columnsA: Column[], columnsB: Column[]) => {
    expect(columnsA.length, 'columns length').toEqual(columnsB.length);
    for (let columnI = 0; columnI < columnsA.length; columnI++) {
        const c_a = columnsA[columnI];
        const c_b = columnsB[columnI];
        expect(c_a.groups.length, `groups length of column ${columnI}`).toEqual(
            c_b.groups.length,
        );
        for (let groupI = 0; groupI < c_a.groups.length; groupI++) {
            const g_a = c_a.groups[groupI];
            const g_b = c_b.groups[groupI];
            expect(g_a.nodes.length, `nodes number of group ${groupI}`).toEqual(
                g_b.nodes.length,
            );
            for (let nodeI = 0; nodeI < g_a.nodes.length; nodeI++) {
                const n_a = g_a.nodes[nodeI];
                const n_b = g_b.nodes[nodeI];
                expect(n_a.content, `node content of node ${nodeI}`).toEqual(
                    n_b.content,
                );
            }
        }
    }
};

export const __generateColumn__ = (
    nodesNumber: number,
    parentId: string,
    parentName: string,
    column?: Column,
) => {
    const nodes = Array.from({ length: nodesNumber }).map((_, i) => {
        return createNode(parentId, undefined, parentName + ' > node ' + i);
    });
    column = column || __column__(parentId);
    const group = findGroup([column], { parentId });
    if (!group) {
        column.groups.push(__group__(parentId));
    }
    __populateColumn__(column, ...nodes);
    return { nodes, column };
};

export const __clone__ = <T>(object: T): T =>
    JSON.parse(JSON.stringify(object));

export const __log__ = <T>(object: T, name: string) => {
    console.log(`const ${name} = ${JSON.stringify(object)}`);
};
