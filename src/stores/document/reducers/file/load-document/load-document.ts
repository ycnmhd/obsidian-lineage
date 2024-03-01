import { jsonTreeToColumns } from 'src/stores/document/helpers/json-to-md/json-to-columns/json-tree-to-columns';
import { markdownToJson } from 'src/stores/document/helpers/json-to-md/markdown-to-json/markdown-to-json';
import { DocumentState } from 'src/stores/document/document-type';
import { SavedDocument } from 'src/stores/document/document-reducer';
import { createFirstNode } from 'src/stores/document/reducers/file/load-document/helpers/create-first-node';
import { findInitialActiveNode } from 'src/stores/document/reducers/state/helpers/find-initial-active-node';
import { updateActiveNode } from 'src/stores/document/reducers/state/update-active-node';

export type LoadDocumentAction =
    | {
          type: 'FILE/LOAD_DOCUMENT';
          payload: {
              document: SavedDocument;
          };
      }
    | {
          type: 'APPLY_SNAPSHOT';
          payload: {
              document: Omit<SavedDocument, 'frontmatter'>;
          };
      };
export const loadDocument = (
    state: DocumentState,
    action: LoadDocumentAction,
) => {
    const tree = markdownToJson(action.payload.document.data);
    state.document = jsonTreeToColumns(tree);
    if (tree.length === 0) {
        createFirstNode(state);
    }
    if (action.type === 'FILE/LOAD_DOCUMENT')
        state.file.frontmatter = action.payload.document.frontmatter;
    const activeNode = findInitialActiveNode(state, action);
    if (activeNode) updateActiveNode(state, activeNode);
    state.state.editing.savePreviousNode = false;
};
