import { DocumentState } from 'src/stores/document/document-reducer';

export const onDragEnd = (store: DocumentState) => {
    store.state.draggedBranch.node = '';
    store.state.draggedBranch.childGroups = new Set();
};
