import { id } from 'src/helpers/id';
import { createNode } from 'src/stores/view/helpers/create-node';
import { Column, Content } from 'src/stores/view/view-state-type';

export const createFirstNode = (columns: Column[], content: Content) => {
    if (columns.length === 0) {
        const rootId = id.rootNode();
        const createdNode = createNode();
        content[createdNode] = null;
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
