import { expect, Page, test } from '@playwright/test';
import { runCommand } from '../helpers/interactions/obsidian-commands/run-command';
import {
    CMD_CLOSE_CURRENT_TAB,
    CMD_GO_TO_NEXT_TAB,
    CMD_GO_TO_PREVIOUS_TAB,
    CMD_UNDO_CLOSE_TAB,
} from '../helpers/consts/commands';
import {
    COLUMN,
    LINEAGE_CARD_ANY,
    LINEAGE_VIEW,
} from '../helpers/consts/selectors';
import { getObsidian } from '../helpers/getters/obsidian';
import { addCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/add-card-using-hotkey';
import { createNewLineageFile } from '../helpers/interactions/lineage-commands/create-new-lineage-file';
import { typeText } from '../helpers/interactions/lineage-card/type-text';
import { moveCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/move-card-using-hotkey';
import { saveCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/save-card-using-hotkey';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands/close-this-tab-group';
import { getActiveCard } from '../helpers/getters/lineage-view/get-active-card';
import { getCardText } from '../helpers/getters/lineage-view/get-card-text';
import { resetTextIndex } from '../helpers/general/helpers';

let obsidian: Page;

test.beforeAll(async () => {
    obsidian = await getObsidian();
});
test.beforeEach(async () => {
    await closeThisTabGroup(obsidian);
    await createNewLineageFile(obsidian);
    resetTextIndex();
});

test('should save card when view is closed', async () => {
    // insert text into f1_n1
    const f1_n1_text = 'file 1 card 1';
    await typeText(obsidian, f1_n1_text);

    // close
    await runCommand(obsidian, CMD_CLOSE_CURRENT_TAB);

    // re-open
    await runCommand(obsidian, CMD_UNDO_CLOSE_TAB);

    // test text
    const f1_n1 = await getActiveCard(obsidian);
    expect(await getCardText(f1_n1)).toEqual(f1_n1_text);
});

test('should handle multiple text areas in parallel', async () => {
    // insert text into f1_n1
    await obsidian.focus(LINEAGE_CARD_ANY);
    const f1_n1_text = 'file 1 card 1';
    await obsidian.keyboard.type(f1_n1_text);

    // create file 2
    await createNewLineageFile(obsidian);

    // insert text into f2_n1
    await obsidian.focus(LINEAGE_CARD_ANY);
    const f2_n1_text = 'file 2 card 1';
    await obsidian.keyboard.type(f2_n1_text);

    // go to f1
    await runCommand(obsidian, CMD_GO_TO_PREVIOUS_TAB);
    await obsidian.focus(LINEAGE_VIEW);

    // save f1_n1
    await obsidian.focus(LINEAGE_CARD_ANY);
    await saveCardUsingHotkey(obsidian);

    // go to f2
    await runCommand(obsidian, CMD_GO_TO_NEXT_TAB);
    await obsidian.focus(LINEAGE_VIEW);

    // save f2_n1
    await obsidian.focus(LINEAGE_CARD_ANY);
    await saveCardUsingHotkey(obsidian);

    // test f2_n1
    const f2_n1 = await getActiveCard(obsidian);
    expect(await getCardText(f2_n1)).toEqual(f2_n1_text);

    // go to f1
    await runCommand(obsidian, CMD_GO_TO_PREVIOUS_TAB);
    await obsidian.focus(LINEAGE_VIEW);

    // test f1_n1
    const f1_n1 = await getActiveCard(obsidian);
    expect(await getCardText(f1_n1)).toEqual(f1_n1_text);
});
test('should save node before moving it', async () => {
    // create a card
    await obsidian.focus(LINEAGE_CARD_ANY);
    const n1_text = 'card 1';
    await obsidian.keyboard.type(n1_text);

    // create a card below
    await addCardUsingHotkey(obsidian, 'down');
    const n2_text = 'card 2';
    await obsidian.keyboard.type(n2_text);

    // move card 2 right without saving
    await moveCardUsingHotkey(obsidian, 'right');

    // assert that both cards are saved
    const columns = await obsidian.$$(COLUMN);
    expect(columns.length).toBe(2);

    // assert n1 content
    const c1_cards = await columns[0].$$(LINEAGE_CARD_ANY);
    expect(c1_cards.length).toBe(1);
    expect(await getCardText(c1_cards[0])).toEqual(n1_text);

    // assert n2 content
    const c2_cards = await columns[1].$$(LINEAGE_CARD_ANY);
    expect(c2_cards.length).toBe(1);
    expect(await getCardText(c2_cards[0])).toEqual(n2_text);
});
