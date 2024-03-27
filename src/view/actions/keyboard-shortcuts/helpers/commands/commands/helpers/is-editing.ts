import { LineageView } from 'src/view/view';

export const isEditing = (view: LineageView) => {
    return !!view.viewStore.getValue().document.editing.activeNodeId;
};
export const isActive = (view: LineageView) => {
    return !!view.viewStore.getValue().document.activeNode;
};
export const isActiveAndNotEditing = (view: LineageView) => {
    return isActive(view) && !isEditing(view);
};

export const isActiveAndEditing = (view: LineageView) => {
    return isActive(view) && isEditing(view);
};
export const isActiveAndNotEditingAndHasFile = (view: LineageView) => {
    return (
        isActiveAndNotEditing(view) && !!view.documentStore.getValue().file.path
    );
};
