import { getActiveView } from '../card/get-active-view';
import invariant from 'tiny-invariant';

export const getNavigateForwardButton = async () => {
    const view = await getActiveView();
    const button = await view.$(`button[aria-label="Navigate forward"]`);
    invariant(button);
    return button;
};
