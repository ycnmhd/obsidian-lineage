import invariant from 'tiny-invariant';
import {
    getActiveCard,
    LINEAGE_CARD_ACTIVE,
} from '../../../getters/lineage-view/card/get-active-card';
import { delay, SHORT } from '../../../general/delay';
import { __obsidian__ } from '../../../getters/obsidian/load-obsidian';

export const SEL_CREATE_CARD_BELOW = `${LINEAGE_CARD_ACTIVE} button[aria-label="Add card below"]`;
export const SEL_CREATE_CARD_ABOVE = `${LINEAGE_CARD_ACTIVE} button[aria-label="Add card above"]`;
export const SEL_CREATE_CARD_CHILD = `${LINEAGE_CARD_ACTIVE} button[aria-label="Add child card"]`;

const buttonSelectors = {
    above: SEL_CREATE_CARD_ABOVE,
    below: SEL_CREATE_CARD_BELOW,
    child: SEL_CREATE_CARD_CHILD,
};
export const createCardUsingButton = async (
    buttonType: 'above' | 'below' | 'child',
) => {
    const card = await getActiveCard();
    await card.click();
    await card.hover();
    await delay(SHORT);
    const button = await __obsidian__.$(buttonSelectors[buttonType], {
        strict: false,
    });
    invariant(button);
    await button.click();
    await delay(SHORT);
};
