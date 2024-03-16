import { AllDirections } from 'src/stores/view/view-store-actions';
import { JumpTarget } from 'src/stores/view/reducers/document/state/jump-to-node';
import { delay, MEDIUM } from '../../general/delay';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';

const directionKeys: Record<AllDirections | JumpTarget, string> = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    'start-of-column': 'Home',
    'end-of-column': 'End',
    'start-of-group': 'PageUp',
    'end-of-group': 'PageDown',
};
export const navigateUsingHotkey = async (
    direction: AllDirections | JumpTarget,
) => {
    await __obsidian__.keyboard.press(`${directionKeys[direction]}`);
    await delay(MEDIUM);
};
