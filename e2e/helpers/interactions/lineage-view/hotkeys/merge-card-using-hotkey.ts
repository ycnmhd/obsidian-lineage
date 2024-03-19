import { VerticalDirection } from 'src/stores/view/view-store-actions';
import { delay, SHORT } from '../../../general/delay';
import { __obsidian__ } from '../../../getters/obsidian/load-obsidian';

const directionKeys: Record<VerticalDirection, string> = {
    up: 'ArrowUp',
    down: 'ArrowDown',
};
export const mergeCardUsingHotkey = async (direction: VerticalDirection) => {
    await __obsidian__.keyboard.press(
        `Control+Shift+${directionKeys[direction]}`,
    );
    await delay(SHORT);
};
