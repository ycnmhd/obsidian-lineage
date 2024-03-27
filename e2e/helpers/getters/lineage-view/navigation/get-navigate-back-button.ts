import { getActiveView } from '../card/get-active-view';
import invariant from 'tiny-invariant';

export const getNavigateBackButton = async () => {
    const view = await getActiveView();
    const button = await view.$(`button[aria-label="Navigate back"]`);
    invariant(button);
    return button;
};
