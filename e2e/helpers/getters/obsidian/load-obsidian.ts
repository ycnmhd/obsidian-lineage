import { _electron as electron } from 'playwright-core';
import { Page } from '@playwright/test';
import { delay } from '../../general/delay';

export let __obsidian__: Page;
export const loadObsidian = async () => {
    if (!__obsidian__) {
        const electronApp = await electron.launch({
            executablePath: process.env.OBSIDIAN_EXECUTABLE_PATH,
        });
        __obsidian__ = await electronApp.firstWindow();
    }
};

export const closeObsidian = async () => {
    if (__obsidian__) {
        await __obsidian__.close();
        __obsidian__ = undefined as never;
        await delay(1000);
    }
};
