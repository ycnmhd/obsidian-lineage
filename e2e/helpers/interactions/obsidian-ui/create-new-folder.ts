import { Page } from '@playwright/test';
import invariant from 'tiny-invariant';
import { delay } from '../../general/helpers';

const SEL_CREATE_FOLDER = 'div[aria-label="New folder"]';
export const createNewFolder = async (obsidian: Page, name: string) => {
    const button = await obsidian.$(SEL_CREATE_FOLDER);
    invariant(button);
    await button.click();
    await delay(100);
    await obsidian.keyboard.type(name);
    await delay(100);
    await obsidian.keyboard.press('Enter');
    await delay(100);
};
