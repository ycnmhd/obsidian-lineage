import { getInlineEditor } from '../../../getters/lineage-view/card/get-inline-editor';
import { delay, SHORT } from '../../../general/delay';
import { __obsidian__ } from '../../../getters/obsidian/load-obsidian';

export const saveCardUsingHotkey = async () => {
    const inlineEditor = await getInlineEditor();
    await inlineEditor.click();
    await __obsidian__.keyboard.press('Control+Shift+Enter');
    await delay(SHORT);
};
