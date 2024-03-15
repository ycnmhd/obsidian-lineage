import { Page } from '@playwright/test';
import { delay, SHORT } from '../../general/helpers';
import { getTextArea } from '../../getters/lineage-view/get-text-area';

export const typeText = async (obsidian: Page, text: string) => {
    const textArea = await getTextArea(obsidian);
    await textArea.focus();
    await obsidian.keyboard.type(text);
    await delay(SHORT);
};
