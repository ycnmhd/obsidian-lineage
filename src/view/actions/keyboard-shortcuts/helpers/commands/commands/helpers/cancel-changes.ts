import { getTextAreaOfView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-text-area-of-view';
import Lineage from 'src/main';
import { getActiveLineageView } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/get-active-lineage-view';

export const discardChanges = (textArea: HTMLTextAreaElement) => {
    textArea.setAttribute('data-discard', 'true');
};

export const cancelChanges = (plugin: Lineage) => {
    const view = getActiveLineageView(plugin);
    const textArea = getTextAreaOfView(view);
    if (textArea) discardChanges(textArea);
    view.viewStore.dispatch({
        type: 'DOCUMENT/DISABLE_EDIT_MODE',
    });
};
