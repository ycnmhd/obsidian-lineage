import { delay, SHORT } from '../../general/delay';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';

export const discardInputChanges = async () => {
    await __obsidian__.keyboard.press('Escape');
    await delay(SHORT);
};
