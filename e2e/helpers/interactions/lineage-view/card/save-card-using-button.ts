import invariant from 'tiny-invariant';
import {
    getActiveCard,
    LINEAGE_CARD_ACTIVE,
} from '../../../getters/lineage-view/card/get-active-card';
import { delay, SHORT } from '../../../general/delay';
import { getActiveView } from '../../../getters/lineage-view/card/get-active-view';

export const SEL_SAVE_CARD = `${LINEAGE_CARD_ACTIVE} button[aria-label="Save"]`;
export const saveCardUsingButton = async () => {
    const card = await getActiveCard();
    await card.click();
    await card.hover();
    await delay(SHORT);
    const view = await getActiveView();
    const button = await view.$(SEL_SAVE_CARD);
    invariant(button);
    await button.click();
};
