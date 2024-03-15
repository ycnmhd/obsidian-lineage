import { Page } from '@playwright/test';
import { rightClickFolder } from './right-click-folder';
import invariant from 'tiny-invariant';
import { delay, MEDIUM } from '../../general/helpers';

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
    await delay(MEDIUM);
};
