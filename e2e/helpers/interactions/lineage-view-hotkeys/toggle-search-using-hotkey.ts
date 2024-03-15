import { Page } from '@playwright/test';
import { delay, SHORT } from '../../general/helpers';

export const toggleSearchUsingHotkey = async (obsidian: Page) => {
    await obsidian.keyboard.press('/');
    await delay(SHORT);
};
