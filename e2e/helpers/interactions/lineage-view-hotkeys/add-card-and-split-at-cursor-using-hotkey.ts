import { Direction } from 'src/stores/view/view-store-actions';
import { addCardUsingHotkey } from './add-card-using-hotkey';

export const addCardAndSplitAtCursorUsingHotkey = async (
    direction: Direction,
) => {
    return addCardUsingHotkey(direction, true);
};
