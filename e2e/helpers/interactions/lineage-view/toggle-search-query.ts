import invariant from 'tiny-invariant';
import { getActiveView } from '../../getters/lineage-view/get-active-view';

const SEL_SEARCH_TOGGLE = `button[aria-label${'Toggle search input'}]`;

export const toggleSearchQuery = async () => {
    const view = await getActiveView();
    const button = await view.$(SEL_SEARCH_TOGGLE);
    invariant(button);
    await button.click();
};
