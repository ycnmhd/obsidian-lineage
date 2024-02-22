import { describe, it } from 'vitest';
import {
    __clone__,
    __compareColumns__,
    __generateColumn__,
} from 'src/view/store/helpers/move-node/helpers/test-helpers';
import { jsonTreeToColumns } from 'src/view/store/helpers/conversion/json-to-columns/json-tree-to-columns';
import { columnsToJsonTree } from 'src/view/store/helpers/conversion/columns-to-json/columns-to-json-tree';
import { Column } from 'src/view/store/document-reducer';

const rootNodeId = 'root';

const {
    column: column1,
    nodes: [node1, node2],
} = __generateColumn__(2, rootNodeId, 'root');

const { column: column2, nodes: node1_children } = __generateColumn__(
    3,
    node1.id,
    'root',
);
__generateColumn__(3, node2.id, 'node 2', column2);
describe('tree-to-columns', () => {
    it.skip('2 columns', () => {
        const input = __clone__([column1, column2]);

        const output = jsonTreeToColumns(columnsToJsonTree(input), rootNodeId);

        __compareColumns__(input, output);
    });

    it('3 columns', () => {
        let column3: Column | undefined;
        for (const node of node1_children) {
            const { column } = __generateColumn__(
                3,
                node.id,
                node.content,
                column3,
            );
            if (!column3) column3 = column;
        }
        const input = __clone__([column1, column2]);
        input.push(column3 as Column);
        const output = jsonTreeToColumns(columnsToJsonTree(input), rootNodeId);
        __compareColumns__(input, output);
    });
});
