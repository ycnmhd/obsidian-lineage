import { expect, test } from '@playwright/test';
import { runCommand } from '../helpers/interactions/run-command';
import {
    CMD_CLOSE_OTHER_TABS,
    CMD_CREATE_FILE,
    CMD_GO_TO_NEXT_TAB,
    CMD_GO_TO_PREVIOUS_TAB,
} from '../helpers/consts/commands';
import { LINEAGE_CARD, LINEAGE_VIEW } from '../helpers/consts/selectors';
import { getCard, getCardText } from '../helpers/getters/lineage-view';
import { saveCard } from '../helpers/interactions/lineage-view-hotkeys';
import { closeObsidian, getObsidian } from '../helpers/getters/obsidian';

test('should handle multiple text areas in parallel', async ({ page }) => {
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

    // create file 2
    await runCommand(obsidian, CMD_CREATE_FILE);
    await obsidian.focus(LINEAGE_VIEW);

    // insert text into f2_n1
    await obsidian.focus(LINEAGE_CARD);
    const f2_n1_text = 'file 2 card 1';
    await obsidian.keyboard.type(f2_n1_text);

    // go to f1
    await runCommand(obsidian, CMD_GO_TO_PREVIOUS_TAB);
    await obsidian.focus(LINEAGE_VIEW);

    // save f1_n1
    await obsidian.focus(LINEAGE_CARD);
    await saveCard(obsidian);

    // go to f2
    await runCommand(obsidian, CMD_GO_TO_NEXT_TAB);
    await obsidian.focus(LINEAGE_VIEW);

    // save f2_n1
    await obsidian.focus(LINEAGE_CARD);
    await saveCard(obsidian);

    // test f2_n1
    const f2_n1 = await getCard(obsidian);
    expect(await getCardText(f2_n1)).toEqual(f2_n1_text);

    // go to f1
    await runCommand(obsidian, CMD_GO_TO_PREVIOUS_TAB);
    await obsidian.focus(LINEAGE_VIEW);

    // test f1_n1
    const f1_n1 = await getCard(obsidian);
    expect(await getCardText(f1_n1)).toEqual(f1_n1_text);
    await closeObsidian();
});
