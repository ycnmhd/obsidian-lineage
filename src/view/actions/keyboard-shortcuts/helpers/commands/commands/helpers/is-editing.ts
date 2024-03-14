import { ViewStore } from 'src/view/view';

export const isEditing = (store: ViewStore) => {
    return !!store.getValue().ui.state.editing.activeNodeId;
};
export const isActive = (store: ViewStore) => {
    return !!store.getValue().document.state.activeNode;
};
export const isActiveAndNotEditing = (store: ViewStore) => {
    return isActive(store) && !isEditing(store);
};

export const isActiveAndEditing = (store: ViewStore) => {
    return isActive(store) && isEditing(store);
};
export const isActiveAndNotEditingAndHasFile = (store: ViewStore) => {
    return isActiveAndNotEditing(store) && !!store.getValue().file.path;
};
