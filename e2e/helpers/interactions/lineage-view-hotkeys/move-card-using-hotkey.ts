import { AllDirections } from 'src/stores/view/view-store-actions';
import { delay, SHORT } from '../../general/delay';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';

const directionKeys: Record<AllDirections, string> = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    right: 'ArrowRight',
    left: 'ArrowLeft',
};
export const moveCardUsingHotkey = async (direction: AllDirections) => {
    await __obsidian__.keyboard.press(`Shift+Alt+${directionKeys[direction]}`);
    await delay(SHORT);
};
