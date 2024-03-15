import { Page } from '@playwright/test';
import { delay, SHORT } from '../../general/helpers';
import { Direction } from 'src/stores/view/view-store-actions';
import { getActiveCard } from '../../getters/lineage-view/get-active-card';
import { maybeGetTextArea } from '../../getters/lineage-view/maybe-get-text-area';

const directionKeys: Record<Direction, string> = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    right: 'ArrowRight',
};
const splitAtCursorKeys: Record<Direction, string> = {
    up: 'k',
    down: 'j',
    right: 'l',
};

export const addCardUsingHotkey = async (
    obsidian: Page,
    direction: Direction,
    splitAtCursor = false,
) => {
    const textArea = await maybeGetTextArea(obsidian);
    if (textArea) {
        await textArea.focus();
    } else {
        if (splitAtCursor) {
            throw new Error('could not find textarea');
        } else {
            const card = await getActiveCard(obsidian);
            await card.focus();
        }
    }
    await obsidian.keyboard.press(
        `Control+${
            splitAtCursor
                ? splitAtCursorKeys[direction]
                : directionKeys[direction]
        }`,
    );
    await delay(SHORT);
};
