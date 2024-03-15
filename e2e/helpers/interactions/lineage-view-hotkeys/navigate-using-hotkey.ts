import { Page } from '@playwright/test';
import { delay, MEDIUM } from '../../general/helpers';
import { AllDirections } from 'src/stores/view/view-store-actions';
import { JumpTarget } from 'src/stores/view/reducers/document/state/jump-to-node';

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
    obsidian: Page,
    direction: AllDirections | JumpTarget,
) => {
    await obsidian.keyboard.press(`${directionKeys[direction]}`);
    await delay(MEDIUM);
};
