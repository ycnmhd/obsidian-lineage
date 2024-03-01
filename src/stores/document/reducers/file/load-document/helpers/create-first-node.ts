import { id } from 'src/helpers/id';
import { createNode } from 'src/stores/document/helpers/create-node';
import { DocumentState } from 'src/stores/document/document-type';

export const createFirstNode = (state: DocumentState) => {
    if (state.document.columns.length === 0) {
        const rootId = id.rootNode();
        const createdNode = createNode();
        state.document.columns.push({
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
