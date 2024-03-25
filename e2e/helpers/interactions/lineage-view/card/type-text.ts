import { getInlineEditor } from '../../../getters/lineage-view/card/get-inline-editor';
import { delay, SHORT } from '../../../general/delay';
import { __obsidian__ } from '../../../getters/obsidian/load-obsidian';

export const typeText = async (
    text: string,
    eventType: 'click' | 'focus' = 'click',
) => {
    const inlineEditor = await getInlineEditor();
    if (eventType === 'click') await inlineEditor.click();
    else await inlineEditor.focus();
    await __obsidian__.keyboard.type(text);
    await delay(SHORT);
};

export const typeTextWithoutClick = async (text: string) => {
    return await typeText(text, 'focus');
};
