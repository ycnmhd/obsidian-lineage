import { delay, SHORT } from '../../../general/delay';
import { __obsidian__ } from '../../../getters/obsidian/load-obsidian';

export const toggleSearchUsingHotkey = async () => {
    await __obsidian__.keyboard.press('/');
    await delay(SHORT);
};
