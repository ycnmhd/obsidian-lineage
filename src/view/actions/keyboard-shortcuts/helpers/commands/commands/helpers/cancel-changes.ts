import { LineageView } from 'src/view/view';
import { inlineEditorViews } from 'src/view/actions/inline-editor/load-inline-editor';

export const discardChanges = (view: LineageView) => {
    inlineEditorViews.delete(view);
};

export const cancelChanges = (view: LineageView) => {
    discardChanges(view);
    view.viewStore.dispatch({
        type: 'DOCUMENT/DISABLE_EDIT_MODE',
    });
};
