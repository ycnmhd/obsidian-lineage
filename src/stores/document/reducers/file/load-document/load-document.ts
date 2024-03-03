import { jsonTreeToColumns } from 'src/stores/document/helpers/json-to-md/json-to-columns/json-tree-to-columns';
import { markdownToJson } from 'src/stores/document/helpers/json-to-md/markdown-to-json/markdown-to-json';
import { ViewState } from 'src/stores/document/document-type';
import { SavedDocument } from 'src/stores/document/document-reducer';
import { createFirstNode } from 'src/stores/document/reducers/file/load-document/helpers/create-first-node';
import { updateActiveNode } from 'src/stores/document/reducers/state/shared/update-active-node';
import { findNextActiveNode } from 'src/stores/document/reducers/state/shared/find-next-node/find-next-active-node';

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
export const loadDocument = (state: ViewState, action: LoadDocumentAction) => {
    const tree = markdownToJson(action.payload.document.data);
    const document = jsonTreeToColumns(tree);
    state.document.columns = document.columns;
    state.document.content = document.content;
    const firstNode = tree.length === 0;
    if (firstNode) {
        createFirstNode(state.document.columns);
    }
    if (action.type === 'FILE/LOAD_DOCUMENT')
        state.file.frontmatter = action.payload.document.frontmatter;
    const activeNode = findNextActiveNode(
        state.document.columns,
        state.document.state,
        action,
    );
    if (activeNode)
        updateActiveNode(
            state.document.columns,
            state.document.state,
            activeNode,
            firstNode,
        );
    state.document.state.editing.savePreviousNode = false;
};
