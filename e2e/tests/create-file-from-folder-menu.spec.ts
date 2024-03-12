//

import { expect, test } from '@playwright/test';
import { closeObsidian, getObsidian } from '../helpers/getters/obsidian';
import { LINEAGE_CARD, MI_NEW_LINEAGE_FILE } from '../helpers/consts/selectors';
import { getCard, getCardText } from '../helpers/getters/lineage-view';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands';
import {
    clickFolderMenuItem,
    createNewFolder,
} from '../helpers/interactions/obsidian-ui';
import { saveCard } from '../helpers/interactions/lineage-view-hotkeys';

test('should create file from context menu', async ({ page }) => {
    const obsidian = await getObsidian();

    // close all tabs
    await closeThisTabGroup(obsidian);
    const folderName = 'new folder ' + Date.now();
    await createNewFolder(obsidian, folderName);

    // create file from context menu
    await clickFolderMenuItem(obsidian, folderName, MI_NEW_LINEAGE_FILE);

    // insert text into f1_n1
    await obsidian.focus(LINEAGE_CARD);
    const f1_n1_text = 'file 1 card 1';
    await obsidian.keyboard.type(f1_n1_text);
    await saveCard(obsidian);

    // test text
    const f1_n1 = await getCard(obsidian);
    expect(await getCardText(f1_n1)).toEqual(f1_n1_text);
    await closeObsidian();
});
