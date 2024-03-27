import { rightClickFolder } from './right-click-folder';
import invariant from 'tiny-invariant';
import { delay, LONG } from '../../general/delay';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';

export const clickFolderMenuItem = async (
    folderName: string,
    itemName: string,
) => {
    await rightClickFolder(folderName);

    // press item div class="menu" > text "New lineage file"
    const menu = await __obsidian__.$('div.menu');
    invariant(menu);
    const item = __obsidian__.getByText(itemName);
    await item.click();
    await delay(LONG);
};
