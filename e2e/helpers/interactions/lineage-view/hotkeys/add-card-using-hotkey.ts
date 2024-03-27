import { Direction } from 'src/stores/document/document-store-actions';
import { getActiveCard } from '../../../getters/lineage-view/card/get-active-card';
import { maybeGetInlineEditor } from '../../../getters/lineage-view/card/maybe-get-inline-editor';
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
    const inlineEditor = await maybeGetInlineEditor();
    if (inlineEditor) {
        await inlineEditor.focus();
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
