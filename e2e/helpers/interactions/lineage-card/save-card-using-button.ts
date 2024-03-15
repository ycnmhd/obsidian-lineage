import { Page } from '@playwright/test';
import { delay, SHORT } from '../../general/helpers';
import { SEL_SAVE_CARD } from '../../consts/selectors';
import invariant from 'tiny-invariant';
import { getActiveCard } from '../../getters/lineage-view/get-active-card';

export const saveCardUsingButton = async (obsidian: Page) => {
    const card = await getActiveCard(obsidian);
    await card.click();
    await card.hover();
    await delay(SHORT);
    const button = await obsidian.$(SEL_SAVE_CARD);
    invariant(button);
    await button.click();
};
