import invariant from 'tiny-invariant';
import { getUndoChangeButton } from '../../../getters/lineage-view/history/get-undo-change-button';
import { delay, SHORT } from '../../../general/delay';

export const undoChangeUsingButton = async () => {
    const button = await getUndoChangeButton();
    invariant(button);
    await button.click();
    await delay(SHORT);
};
