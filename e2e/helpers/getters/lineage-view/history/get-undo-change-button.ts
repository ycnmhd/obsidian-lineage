import { getActiveView } from '../card/get-active-view';
import invariant from 'tiny-invariant';
import { SEL_CONTROLS_BAR } from './get-redo-change-button';

export const SEL_UNDO_BUTTON = `${SEL_CONTROLS_BAR} button[aria-label="Undo"]`;
export const getUndoChangeButton = async () => {
    const view = await getActiveView();
    const button = await view.$(SEL_UNDO_BUTTON);
    invariant(button);
    return button;
};
