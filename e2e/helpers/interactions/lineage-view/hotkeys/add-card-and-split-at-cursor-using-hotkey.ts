import { Direction } from 'src/stores/document/document-store-actions';
import { addCardUsingHotkey } from './add-card-using-hotkey';

export const addCardAndSplitAtCursorUsingHotkey = async (
    direction: Direction,
) => {
    return addCardUsingHotkey(direction, true);
};
