import { getInlineEditor } from '../../../getters/lineage-view/card/get-inline-editor';
import { delay, SHORT } from '../../../general/delay';
import { __obsidian__ } from '../../../getters/obsidian/load-obsidian';

export const typeText = async (text: string) => {
    const inlineEditor = await getInlineEditor();
    await inlineEditor.click();
    await __obsidian__.keyboard.type(text);
    await delay(SHORT);
};
