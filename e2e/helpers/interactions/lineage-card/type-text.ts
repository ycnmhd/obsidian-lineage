import { getTextArea } from '../../getters/lineage-view/get-text-area';
import { delay, SHORT } from '../../general/delay';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';

export const typeText = async (text: string) => {
    const textArea = await getTextArea();
    await textArea.focus();
    await __obsidian__.keyboard.type(text);
    await delay(SHORT);
};
