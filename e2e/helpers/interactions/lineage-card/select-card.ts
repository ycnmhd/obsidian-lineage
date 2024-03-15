import { Page } from '@playwright/test';
import { MARKDOWN_PREVIEW } from '../../consts/selectors';
import { delay, SHORT } from '../../general/helpers';
import { getCardsOfColumns } from '../../getters/lineage-view/get-cards-of-columns';

export const selectCard = async (
    obsidian: Page,
    column: number,
    cardNumber: number,
) => {
    const card = (await getCardsOfColumns(obsidian))[column][cardNumber];
    await card.click();
    await card.waitForSelector(MARKDOWN_PREVIEW);
    await delay(SHORT);
};
