import invariant from 'tiny-invariant';

import { delay } from '../../general/delay';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';

const SEL_CREATE_FOLDER = 'div[aria-label="New folder"]';
export const createNewFolder = async (name: string) => {
    const button = await __obsidian__.$(SEL_CREATE_FOLDER);
    invariant(button);
    await button.click();
    await delay(100);
    await __obsidian__.keyboard.type(name);
    await delay(100);
    await __obsidian__.keyboard.press('Enter');
    await delay(100);
};
