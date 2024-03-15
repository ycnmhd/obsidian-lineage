import { Page } from '@playwright/test';
import { delay, SHORT } from '../../general/helpers';
import { getTextArea } from '../../getters/lineage-view/get-text-area';

export const saveCardUsingHotkey = async (obsidian: Page) => {
    const textArea = await getTextArea(obsidian);
    await textArea.click();
    await obsidian.keyboard.press('Control+Shift+Enter');
    await delay(SHORT);
};
