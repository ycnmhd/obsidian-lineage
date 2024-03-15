import { Page } from '@playwright/test';
import { getCardsOfColumns } from './get-cards-of-columns';
import { getCardText } from './get-card-text';

export const getTextsOfColumns = async (obsidian: Page) => {
    const columns = await getCardsOfColumns(obsidian);
    return (await Promise.all(
        columns.map(
            async (c) => await Promise.all(c.map((n) => getCardText(n))),
        ),
    )) as string[][];
};
