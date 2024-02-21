import { DocumentState } from 'src/view/store/document-reducer';

export const onDragEnd = (store: DocumentState) => {
    store.state.draggedBranch.node = '';
    store.state.draggedBranch.childGroups = new Set();
};
