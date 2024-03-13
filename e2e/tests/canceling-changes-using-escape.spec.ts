import { expect, test } from '@playwright/test';
import { LINEAGE_CARD } from '../helpers/consts/selectors';
import { getActiveCard, getCardText } from '../helpers/getters/lineage-view';
import { closeObsidian, getObsidian } from '../helpers/getters/obsidian';
import { createNewLineageFile } from '../helpers/interactions/lineage-commands';
import { closeOtherTabs } from '../helpers/interactions/obsidian-commands';

test('should discard changes when user presses escape', async () => {
    const obsidian = await getObsidian();

    // create file 1
    await createNewLineageFile(obsidian);
    await closeOtherTabs(obsidian);

    // insert text into f1_n1
    await obsidian.focus(LINEAGE_CARD);
    const f1_n1_text = 'file 1 card 1';
    await obsidian.keyboard.type(f1_n1_text);

    // cancel changes
    await obsidian.keyboard.press('Escape');

    // test text
    const f1_n1 = await getActiveCard(obsidian);
    expect(await getCardText(f1_n1)).toEqual('');
    await closeObsidian();
});
