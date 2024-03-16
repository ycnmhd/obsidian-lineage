import { delay, SHORT } from '../../general/delay';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';

export const repeatPressKey = async (key: string, n: number) => {
    for (let i = 0; i < n; i++) {
        await __obsidian__.keyboard.press(key, { delay: 10 });
        await delay(SHORT);
    }
};
