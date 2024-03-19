import { getTextArea } from '../../../getters/lineage-view/card/get-text-area';
import { delay, SHORT } from '../../../general/delay';
import { __obsidian__ } from '../../../getters/obsidian/load-obsidian';

export const saveCardUsingHotkey = async () => {
    const textArea = await getTextArea();
    await textArea.click();
    await __obsidian__.keyboard.press('Control+Shift+Enter');
    await delay(SHORT);
};
