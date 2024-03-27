import { LineageView } from 'src/view/view';

export const discardChanges = (view: LineageView) => {
    view.inlineEditor.unloadNode();
};

export const cancelChanges = (view: LineageView) => {
    discardChanges(view);
    view.viewStore.dispatch({
        type: 'DOCUMENT/DISABLE_EDIT_MODE',
    });
};
