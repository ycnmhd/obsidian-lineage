import { Page } from '@playwright/test';
import { delay, SHORT } from '../../general/helpers';
import { AllDirections } from 'src/stores/view/view-store-actions';

const directionKeys: Record<AllDirections, string> = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    right: 'ArrowRight',
    left: 'ArrowLeft',
};
export const moveCardUsingHotkey = async (
    obsidian: Page,
    direction: AllDirections,
) => {
    await obsidian.keyboard.press(`Shift+Alt+${directionKeys[direction]}`);
    await delay(SHORT);
};
