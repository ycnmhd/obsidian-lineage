import { Page } from '@playwright/test';
import { COLUMN, LINEAGE_CARD_ANY } from '../../consts/selectors';

export const getCardsOfColumns = async (obsidian: Page) => {
    const columns = await obsidian.$$(COLUMN);

    return await Promise.all(columns.map((c) => c.$$(LINEAGE_CARD_ANY)));
};
