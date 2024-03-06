import { ViewState } from 'src/stores/view/view-state-type';
import { defaultViewState } from 'src/stores/view/default-view-state';

export const resetDocument = (state: ViewState) => {
    const newState = defaultViewState();
    state.document = newState.document;
    state.history = newState.history;
    state.file = newState.file;
    state.ui = newState.ui;
};
