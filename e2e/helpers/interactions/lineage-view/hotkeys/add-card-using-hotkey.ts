import { Direction } from 'src/stores/document/document-store-actions';
import { getActiveCard } from '../../../getters/lineage-view/card/get-active-card';
import { maybeGetTextArea } from '../../../getters/lineage-view/card/maybe-get-text-area';
import { delay, SHORT } from '../../../general/delay';
import { __obsidian__ } from '../../../getters/obsidian/load-obsidian';

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
    direction: Direction,
    splitAtCursor = false,
) => {
    const textArea = await maybeGetTextArea();
    if (textArea) {
        await textArea.focus();
    } else {
        if (splitAtCursor) {
            throw new Error('could not find textarea');
        } else {
            const card = await getActiveCard();
            await card.click();
        }
    }
    await __obsidian__.keyboard.press(
        `Control+${
            splitAtCursor
                ? splitAtCursorKeys[direction]
                : directionKeys[direction]
        }`,
    );
    await delay(SHORT);
};
