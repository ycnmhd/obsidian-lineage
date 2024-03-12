import { expect, test } from '@playwright/test';
import { runCommand } from '../helpers/interactions/run-command';
import {
    CMD_CLOSE_CURRENT_TAB,
    CMD_CLOSE_OTHER_TABS,
    CMD_CREATE_FILE,
    CMD_UNDO_CLOSE_TAB,
} from '../helpers/consts/commands';
import { LINEAGE_CARD, LINEAGE_VIEW } from '../helpers/consts/selectors';
import { getCard, getCardText } from '../helpers/getters/lineage-view';
import { closeObsidian, getObsidian } from '../helpers/getters/obsidian';

test('should save card when view is closed', async ({ page }) => {
    const obsidian = await getObsidian();

    // create file 1
    await runCommand(obsidian, CMD_CREATE_FILE);
    await obsidian.focus(LINEAGE_VIEW);
    await runCommand(obsidian, CMD_CLOSE_OTHER_TABS, false);
    await obsidian.focus(LINEAGE_VIEW);

    // insert text into f1_n1
    await obsidian.focus(LINEAGE_CARD);
    const f1_n1_text = 'file 1 card 1';
    await obsidian.keyboard.type(f1_n1_text);

    // close
    await runCommand(obsidian, CMD_CLOSE_CURRENT_TAB);

    // re-open
    await runCommand(obsidian, CMD_UNDO_CLOSE_TAB);

    await obsidian.focus(LINEAGE_VIEW);

    // test text
    const f1_n1 = await getCard(obsidian);
    expect(await getCardText(f1_n1)).toEqual(f1_n1_text);
    await closeObsidian();
});
