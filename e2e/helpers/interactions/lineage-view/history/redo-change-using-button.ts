import invariant from 'tiny-invariant';
import { getRedoChangeButton } from '../../../getters/lineage-view/history/get-redo-change-button';
import { delay, SHORT } from '../../../general/delay';

export const redoChangeUsingButton = async () => {
    const button = await getRedoChangeButton();
    invariant(button);
    await button.click();
    await delay(SHORT);
};
