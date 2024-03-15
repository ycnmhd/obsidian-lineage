import {
    SEL_CREATE_CARD_ABOVE,
    SEL_CREATE_CARD_BELOW,
    SEL_CREATE_CARD_CHILD,
} from '../../consts/selectors';
import { Page } from '@playwright/test';
import { delay, SHORT } from '../../general/helpers';
import invariant from 'tiny-invariant';
import { getActiveCard } from '../../getters/lineage-view/get-active-card';

const buttonSelectors = {
    above: SEL_CREATE_CARD_ABOVE,
    below: SEL_CREATE_CARD_BELOW,
    child: SEL_CREATE_CARD_CHILD,
};

export const createCardUsingButton = async (
    obsidian: Page,
    buttonType: 'above' | 'below' | 'child',
) => {
    const card = await getActiveCard(obsidian);
    await card.click();
    await card.hover();
    await delay(SHORT);
    const button = await obsidian.$(buttonSelectors[buttonType], {
        strict: false,
    });
    invariant(button);
    await button.click();
    await delay(SHORT);
};
