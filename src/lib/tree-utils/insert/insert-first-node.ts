import { id } from 'src/helpers/id';
import { Column, Content } from 'src/stores/document/document-state-type';

export const insertFirstNode = (columns: Column[], content: Content) => {
    if (columns.length === 0) {
        const rootId = id.rootNode();
        const createdNode = id.node();
        content[createdNode] = { content: '' };
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
