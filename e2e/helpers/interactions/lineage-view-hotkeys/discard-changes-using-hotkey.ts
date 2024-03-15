import { Page } from '@playwright/test';
import { LINEAGE_CARD_ACTIVE } from '../../consts/selectors';
import { delay, SHORT } from '../../general/helpers';

export const discardChangesUsingHotkey = async (obsidian: Page) => {
    await obsidian.waitForSelector(LINEAGE_CARD_ACTIVE);
    await obsidian.keyboard.press('Escape');
    await delay(SHORT);
};
