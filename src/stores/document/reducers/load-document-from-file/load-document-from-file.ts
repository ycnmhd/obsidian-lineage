import { jsonTreeToColumns } from 'src/stores/view/helpers/json-to-md/json-to-columns/json-tree-to-columns';
import { markdownToJson } from 'src/stores/view/helpers/json-to-md/markdown-to-json/markdown-to-json';
import { DocumentState } from 'src/stores/document/document-state-type';
import { SavedDocument } from 'src/stores/document/document-store-actions';
import { createFirstNode } from 'src/stores/document/reducers/load-document-from-file/helpers/create-first-node';
import invariant from 'tiny-invariant';

export type LoadDocumentAction = {
    type: 'DOCUMENT/LOAD_FILE';
    payload: {
        document: SavedDocument;
    };
};

export const loadDocumentFromFile = (
    state: DocumentState,
    action: LoadDocumentAction,
) => {
    const tree = markdownToJson(action.payload.document.data);
    const document = jsonTreeToColumns(tree);
    state.document.columns = document.columns;
    state.document.content = document.content;
    const emptyTree = tree.length === 0;
    if (emptyTree) {
        createFirstNode(state.document.columns, state.document.content);
    }
    if (action.type === 'DOCUMENT/LOAD_FILE')
        state.file.frontmatter = action.payload.document.frontmatter;
    const activeNode = state.document.columns[0].groups[0].nodes[0];
    invariant(activeNode);

    return activeNode;
};
