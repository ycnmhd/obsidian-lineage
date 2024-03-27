import invariant from 'tiny-invariant';
import {
    getActiveCard,
    LINEAGE_CARD_ACTIVE,
} from '../../../getters/lineage-view/card/get-active-card';
import { delay, SHORT } from '../../../general/delay';
import { getActiveView } from '../../../getters/lineage-view/card/get-active-view';

export const SEL_EDIT_CARD = `${LINEAGE_CARD_ACTIVE} button[aria-label="Edit"]`;
export const toggleCardEditUsingButton = async () => {
    const card = await getActiveCard();
    await card.click();
    await card.hover();
    await delay(SHORT);
    const view = await getActiveView();
    const button = await view.$(SEL_EDIT_CARD);
    invariant(button);
    await button.click();
    await delay(SHORT);
};
