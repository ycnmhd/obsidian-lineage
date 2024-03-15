import { Page } from '@playwright/test';
import { COLUMN, LINEAGE_CARD_ANY } from '../../consts/selectors';
import { getActiveView } from './get-active-view';

export const getCardsOfColumns = async (obsidian: Page) => {
    const view = await getActiveView(obsidian);
    const columns = await view.$$(COLUMN);

    return await Promise.all(columns.map((c) => c.$$(LINEAGE_CARD_ANY)));
};
