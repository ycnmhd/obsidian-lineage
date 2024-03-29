import { getActiveView } from '../card/get-active-view';
import invariant from 'tiny-invariant';

export const SEL_CONTROLS_BAR = `.controls-container`;
export const SEL_REDO_BUTTON = `${SEL_CONTROLS_BAR} button[aria-label="Redo"]`;
export const getRedoChangeButton = async () => {
    const view = await getActiveView();
    const button = await view.$(SEL_REDO_BUTTON);
    invariant(button);
    return button;
};
