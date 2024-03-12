import { Page } from '@playwright/test';
import invariant from 'tiny-invariant';
import { delay } from '../general/delay';

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

export const rightClickFolder = async (obsidian: Page, name: string) => {
    const button = await obsidian.$(`div[data-path="${name}"]`);
    invariant(button);
    await button.click({ button: 'right' });
};

export const clickFolderMenuItem = async (
    obsidian: Page,
    folderName: string,
    itemName: string,
) => {
    await rightClickFolder(obsidian, folderName);

    // press item div class="menu" > text "New lineage file"
    const menu = await obsidian.$('div.menu');
    invariant(menu);
    const item = obsidian.getByText(itemName);
    await item.click();
};
