import { Page } from '@playwright/test';
import { typeText } from './type-text';

import { saveCardUsingHotkey } from '../lineage-view-hotkeys/save-card-using-hotkey';

export const typeTextAndSaveItUsingHotkey = async (
    obsidian: Page,
    text: string,
) => {
    await typeText(obsidian, text);
    await saveCardUsingHotkey(obsidian);
};
