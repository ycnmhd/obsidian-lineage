import { typeText } from './type-text';

import { saveCardUsingHotkey } from '../hotkeys/save-card-using-hotkey';

export const typeTextAndSaveItUsingHotkey = async (text: string) => {
    await typeText(text);
    await saveCardUsingHotkey();
};
