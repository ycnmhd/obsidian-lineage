import { id } from 'src/helpers/id';
import { createNode } from 'src/stores/document/helpers/create-node';
import { Column } from 'src/stores/document/document-type';

export const createFirstNode = (columns: Column[]) => {
    if (columns.length === 0) {
        const rootId = id.rootNode();
        const createdNode = createNode();
        columns.push({
            id: id.column(),
            groups: [
                {
                    parentId: rootId,
                    nodes: [createdNode],
                },
            ],
        });
    }
};
