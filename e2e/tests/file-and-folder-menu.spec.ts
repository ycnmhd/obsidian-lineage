import { expect, test } from '../helpers/base-test';
import { typeText } from '../helpers/interactions/lineage-view/card/type-text';
import { saveCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/save-card-using-hotkey';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands/close-this-tab-group';
import { clickFolderMenuItem } from '../helpers/interactions/obsidian-ui/click-folder-menu-item';
import { createNewFolder } from '../helpers/interactions/obsidian-ui/create-new-folder';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/card/get-texts-of-columns';
import { text } from '../helpers/general/text';

export const MI_NEW_LINEAGE_FILE = 'New lineage file';

test('should create file from context menu', async () => {
    await closeThisTabGroup();
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
