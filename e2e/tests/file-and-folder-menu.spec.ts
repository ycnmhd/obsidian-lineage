//

import { expect, test } from '@playwright/test';

import { typeText } from '../helpers/interactions/lineage-card/type-text';
import { saveCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/save-card-using-hotkey';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands/close-this-tab-group';
import { clickFolderMenuItem } from '../helpers/interactions/obsidian-ui/click-folder-menu-item';
import { createNewFolder } from '../helpers/interactions/obsidian-ui/create-new-folder';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/get-texts-of-columns';
import { loadObsidian } from '../helpers/getters/obsidian/load-obsidian';
import { resetTextIndex, text } from '../helpers/general/text';

export const MI_NEW_LINEAGE_FILE = 'New lineage file';

test.beforeAll(async () => {
    await loadObsidian();
});
test.beforeEach(async () => {
    await closeThisTabGroup();
    // await createNewLineageFile();
    resetTextIndex();
});

test('should create file from context menu', async () => {
    await loadObsidian();

    // close all tabs
    const folderName = 'new folder ' + Date.now();
    await createNewFolder(folderName);

    // create file from context menu
    await clickFolderMenuItem(folderName, MI_NEW_LINEAGE_FILE);

    // insert text into f1_n1
    const f1_n1_text = text();
    await typeText(f1_n1_text);
    await saveCardUsingHotkey();

    const cs = await getTextsOfColumns();
    expect(cs).toEqual([[f1_n1_text]]);
});
