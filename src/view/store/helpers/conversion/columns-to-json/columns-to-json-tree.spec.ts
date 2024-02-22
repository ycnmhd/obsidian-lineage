import { describe, expect, it } from 'vitest';
import {
    __column__,
    __generateColumn__,
    __populateColumn__,
    __treeNode__,
} from 'src/view/store/helpers/move-node/helpers/test-helpers';
import { createNode } from 'src/view/store/helpers/create-node';
import { columnsToJsonTree } from 'src/view/store/helpers/conversion/columns-to-json/columns-to-json-tree';

const rootNodeId = 'root';

describe('columns-to-json', () => {
    it('one column', () => {
        const node1 = createNode(rootNodeId, undefined, '1');
        const node2 = createNode(rootNodeId, undefined, '2');
        const column1 = __column__(rootNodeId);
        __populateColumn__(column1, node1, node2);
        const output = [__treeNode__(node1), __treeNode__(node2)];
        const input = [column1];
        expect(columnsToJsonTree(input)).toEqual(output);
    });
    it('two columns', () => {
        const {
            column: column1,
            nodes: [node1, node2],
        } = __generateColumn__(2, rootNodeId, 'root');

        const { column: column2, nodes: node1_children } = __generateColumn__(
            3,
            node1.id,
            'node 1',
        );
        const { nodes: node2_children } = __generateColumn__(
            3,
            node2.id,
            'node 2',
            column2,
        );
        const output = [
            __treeNode__(node1, ...node1_children),
            __treeNode__(node2, ...node2_children),
        ];
        const input = [column1, column2];
        expect(columnsToJsonTree(input)).toEqual(output);
    });
});
