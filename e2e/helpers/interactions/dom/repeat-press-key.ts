import { Page } from '@playwright/test';
import { delay, SHORT } from '../../general/helpers';

export const repeatPressKey = async (
    obsidian: Page,
    key: string,
    n: number,
) => {
    for (let i = 0; i < n; i++) {
        await obsidian.keyboard.press(key, { delay: 10 });
        await delay(SHORT);
    }
};
