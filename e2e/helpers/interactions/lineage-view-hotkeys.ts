import { Page } from '@playwright/test';
import { delay } from '../general/delay';
import { getTextArea } from '../getters/lineage-view';

export const moveCardRight = async (obsidian: Page) => {
    await obsidian.keyboard.press('Shift+Alt+ArrowRight');
    await delay(200);
};
export const createCardBelow = async (obsidian: Page) => {
    await obsidian.keyboard.press('Control+J');
    await delay(200);
};

export const saveCard = async (obsidian: Page) => {
    const textArea = await getTextArea(obsidian);
    await textArea.click();
    await obsidian.keyboard.press('Control+Shift+Enter');
    await delay(200);
};
