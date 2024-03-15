import { _electron as electron } from 'playwright-core';
import { Page } from '@playwright/test';
import { SEL_ACTIVE_LEAF } from '../consts/selectors';
import invariant from 'tiny-invariant';
import { delay } from '../general/helpers';

const __obsidianInstance__: { current: Page | null } = {
    current: null,
};

export const closeObsidian = async () => {
    if (__obsidianInstance__.current) {
        await __obsidianInstance__.current.close();
        await delay(1000);
    }
};

export const getObsidian = async () => {
    if (__obsidianInstance__.current) return __obsidianInstance__.current;
    const electronApp = await electron.launch({
        executablePath: process.env.OBSIDIAN_EXECUTABLE_PATH,
    });
    const obsidian = await electronApp.firstWindow();
    __obsidianInstance__.current = obsidian;
    return obsidian;
};
export const getActiveLeaf = async (obsidian: Page) => {
    const leaf = await obsidian.$(SEL_ACTIVE_LEAF);
    invariant(leaf);
    return leaf;
};
