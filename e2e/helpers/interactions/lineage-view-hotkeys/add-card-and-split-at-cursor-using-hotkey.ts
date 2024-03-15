import { Page } from '@playwright/test';
import { Direction } from 'src/stores/view/view-store-actions';
import { addCardUsingHotkey } from './add-card-using-hotkey';

export const addCardAndSplitAtCursorUsingHotkey = async (
    obsidian: Page,
    direction: Direction,
) => {
    return addCardUsingHotkey(obsidian, direction, true);
};
