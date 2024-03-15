//

import { expect, test } from '@playwright/test';
import { getObsidian } from '../helpers/getters/obsidian';
import { MI_NEW_LINEAGE_FILE } from '../helpers/consts/selectors';

import { typeText } from '../helpers/interactions/lineage-card/type-text';
import { saveCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/save-card-using-hotkey';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands/close-this-tab-group';
import { clickFolderMenuItem } from '../helpers/interactions/obsidian-ui/click-folder-menu-item';
import { createNewFolder } from '../helpers/interactions/obsidian-ui/create-new-folder';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/get-texts-of-columns';

test('should create file from context menu', async () => {
    const obsidian = await getObsidian();

    // close all tabs
    await closeThisTabGroup(obsidian);
    const folderName = 'new folder ' + Date.now();
    await createNewFolder(obsidian, folderName);

    // create file from context menu
    await clickFolderMenuItem(obsidian, folderName, MI_NEW_LINEAGE_FILE);

    // insert text into f1_n1
    const f1_n1_text = 'file 1 card 1';
    await typeText(obsidian, f1_n1_text);
    await saveCardUsingHotkey(obsidian);

    const cs = await getTextsOfColumns(obsidian);
    expect(cs).toEqual([[f1_n1_text]]);
});
