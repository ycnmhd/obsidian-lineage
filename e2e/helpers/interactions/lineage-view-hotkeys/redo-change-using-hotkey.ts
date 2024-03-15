import { Page } from '@playwright/test';
import { LINEAGE_CARD_ACTIVE } from '../../consts/selectors';
import { delay, SHORT } from '../../general/helpers';

export const redoChangeUsingHotkey = async (obsidian: Page) => {
    await obsidian.waitForSelector(LINEAGE_CARD_ACTIVE);
    await obsidian.keyboard.press('Control+Shift+y');
    await delay(SHORT);
};