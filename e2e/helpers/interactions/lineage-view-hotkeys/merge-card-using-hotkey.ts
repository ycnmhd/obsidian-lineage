import { Page } from '@playwright/test';
import { delay, SHORT } from '../../general/helpers';
import { VerticalDirection } from 'src/stores/view/view-store-actions';

const directionKeys: Record<VerticalDirection, string> = {
    up: 'ArrowUp',
    down: 'ArrowDown',
};
export const mergeCardUsingHotkey = async (
    obsidian: Page,
    direction: VerticalDirection,
) => {
    await obsidian.keyboard.press(`Control+Shift+${directionKeys[direction]}`);
    await delay(SHORT);
};
