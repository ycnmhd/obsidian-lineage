import { expect, Page, test } from '@playwright/test';
import { getObsidian } from '../helpers/getters/obsidian';
import { createNewLineageFile } from '../helpers/interactions/lineage-commands/create-new-lineage-file';
import { addCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/add-card-using-hotkey';
import { delay, resetTextIndex, SHORT, text } from '../helpers/general/helpers';
import { typeText } from '../helpers/interactions/lineage-card/type-text';
import { editCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/edit-card-using-hotkey';
import { discardChangesUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/discard-changes-using-hotkey';
import { saveCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/save-card-using-hotkey';
import { addCardAndSplitAtCursorUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/add-card-and-split-at-cursor-using-hotkey';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands/close-this-tab-group';
import { repeatPressKey } from '../helpers/interactions/dom/repeat-press-key';
import { selectCard } from '../helpers/interactions/lineage-card/select-card';
import { moveCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/move-card-using-hotkey';
import { mergeCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/merge-card-using-hotkey';
import { deleteCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/delete-card-using-hotkey';
import { navigateUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/navigate-using-hotkey';
import { typeTextAndSaveItUsingHotkey } from '../helpers/interactions/lineage-card/type-text-and-save-it-using-hotkey';
import { undoChangeUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/undo-change-using-hotkey';
import { redoChangeUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/redo-change-using-hotkey';
import { toggleSearchUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/toggle-search-using-hotkey';
import { setSearchQuery } from '../helpers/interactions/lineage-view/set-search-query';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/get-texts-of-columns';

let obsidian: Page;

test.beforeAll(async () => {
    obsidian = await getObsidian();
});
test.beforeEach(async () => {
    await closeThisTabGroup(obsidian);
    await createNewLineageFile(obsidian);
    resetTextIndex();
});

test('save card, edit card and discard changes using hotkey', async () => {
    const n1 = text();
    await typeText(obsidian, n1);
    await saveCardUsingHotkey(obsidian);

    const n1_b = text();
    await editCardUsingHotkey(obsidian);
    await typeText(obsidian, n1_b);
    await saveCardUsingHotkey(obsidian);

    const n1_c = text();
    await editCardUsingHotkey(obsidian);
    await typeText(obsidian, n1_c);
    await discardChangesUsingHotkey(obsidian);

    expect(await getTextsOfColumns(obsidian)).toEqual([[n1 + n1_b]]);
});

test('create cards using hotkeys', async () => {
    const n1 = text();
    await typeText(obsidian, n1);

    await addCardUsingHotkey(obsidian, 'up');
    const n2 = text();
    await typeText(obsidian, n2);

    await addCardUsingHotkey(obsidian, 'down');
    const n3 = text();
    await typeText(obsidian, n3);

    await addCardUsingHotkey(obsidian, 'right');
    const n4 = text();
    await typeText(obsidian, n4);
    await saveCardUsingHotkey(obsidian);

    const cs = await getTextsOfColumns(obsidian);
    expect(cs).toEqual([[n2, n3, n1], [n4]]);
});

test('create cards and split at cursor using hotkeys', async () => {
    const n1 = text();
    await typeText(obsidian, n1);
    const n2 = text();
    await typeText(obsidian, n2);

    await repeatPressKey(obsidian, 'ArrowLeft', n2.length);
    await addCardAndSplitAtCursorUsingHotkey(obsidian, 'up');
    const n3 = text();
    await typeText(obsidian, n3);

    await repeatPressKey(obsidian, 'ArrowLeft', n3.length);
    await addCardAndSplitAtCursorUsingHotkey(obsidian, 'down');
    const n4 = text();
    await typeText(obsidian, n4);

    await repeatPressKey(obsidian, 'ArrowLeft', n4.length);
    await addCardAndSplitAtCursorUsingHotkey(obsidian, 'right');
    await saveCardUsingHotkey(obsidian);

    const cs = await getTextsOfColumns(obsidian);
    expect(cs).toEqual([[n1, n3, n2], [n4]]);
});

test('move card', async () => {
    const n1 = text();
    await typeText(obsidian, n1);

    const n2 = text();
    await addCardUsingHotkey(obsidian, 'up');
    await typeText(obsidian, n2);

    const n3 = text();
    await addCardUsingHotkey(obsidian, 'up');
    await typeText(obsidian, n3);

    const n4 = text();
    await addCardUsingHotkey(obsidian, 'up');
    await typeText(obsidian, n4);
    await saveCardUsingHotkey(obsidian);

    expect(await getTextsOfColumns(obsidian)).toEqual([[n4, n3, n2, n1]]);

    await selectCard(obsidian, 0, 3);
    await moveCardUsingHotkey(obsidian, 'up');
    expect(await getTextsOfColumns(obsidian)).toEqual([[n4, n3, n1, n2]]);

    await moveCardUsingHotkey(obsidian, 'up');
    expect(await getTextsOfColumns(obsidian)).toEqual([[n4, n1, n3, n2]]);

    await selectCard(obsidian, 0, 0);
    await moveCardUsingHotkey(obsidian, 'down');
    expect(await getTextsOfColumns(obsidian)).toEqual([[n1, n4, n3, n2]]);

    await selectCard(obsidian, 0, 3);
    await moveCardUsingHotkey(obsidian, 'right');
    expect(await getTextsOfColumns(obsidian)).toEqual([[n1, n4, n3], [n2]]);

    await selectCard(obsidian, 0, 1);
    await moveCardUsingHotkey(obsidian, 'right');
    await moveCardUsingHotkey(obsidian, 'right');
    expect(await getTextsOfColumns(obsidian)).toEqual([[n1, n3], [n2], [n4]]);

    await selectCard(obsidian, 2, 0);
    await moveCardUsingHotkey(obsidian, 'left');
    expect(await getTextsOfColumns(obsidian)).toEqual([
        [n1, n3],
        [n2, n4],
    ]);

    await selectCard(obsidian, 1, 0);
    await moveCardUsingHotkey(obsidian, 'left');
    expect(await getTextsOfColumns(obsidian)).toEqual([[n1, n3, n2], [n4]]);
});

test('merge node', async () => {
    const n1 = text();
    await typeText(obsidian, n1);

    const n2 = text();
    await addCardUsingHotkey(obsidian, 'up');
    await typeText(obsidian, n2);

    const n3 = text();
    await addCardUsingHotkey(obsidian, 'up');
    await typeText(obsidian, n3);

    const n4 = text();
    await addCardUsingHotkey(obsidian, 'up');
    await typeText(obsidian, n4);
    await saveCardUsingHotkey(obsidian);

    expect(await getTextsOfColumns(obsidian)).toEqual([[n4, n3, n2, n1]]);

    await mergeCardUsingHotkey(obsidian, 'up');
    expect(await getTextsOfColumns(obsidian)).toEqual([[n4, n3, n2, n1]]);

    await mergeCardUsingHotkey(obsidian, 'down');
    const n4_n3 = `${n4} ${n3}`;
    expect(await getTextsOfColumns(obsidian)).toEqual([[n4_n3, n2, n1]]);

    await selectCard(obsidian, 0, 2);
    await mergeCardUsingHotkey(obsidian, 'down');
    expect(await getTextsOfColumns(obsidian)).toEqual([[n4_n3, n2, n1]]);

    await mergeCardUsingHotkey(obsidian, 'up');
    const n2_n1 = `${n2} ${n1}`;
    expect(await getTextsOfColumns(obsidian)).toEqual([[n4_n3, n2_n1]]);
});

test('delete cards using hotkey', async () => {
    const n1 = text();
    await typeText(obsidian, n1);

    await addCardUsingHotkey(obsidian, 'up');
    const n2 = text();
    await typeText(obsidian, n2);

    await addCardUsingHotkey(obsidian, 'down');
    const n3 = text();
    await typeText(obsidian, n3);

    await addCardUsingHotkey(obsidian, 'right');
    const n4 = text();
    await typeText(obsidian, n4);
    await saveCardUsingHotkey(obsidian);

    expect(await getTextsOfColumns(obsidian)).toEqual([[n2, n3, n1], [n4]]);

    await selectCard(obsidian, 0, 1);
    await deleteCardUsingHotkey(obsidian);
    expect(await getTextsOfColumns(obsidian)).toEqual([[n2, n1]]);

    await deleteCardUsingHotkey(obsidian);
    expect(await getTextsOfColumns(obsidian)).toEqual([[n1]]);

    await deleteCardUsingHotkey(obsidian);
    expect(await getTextsOfColumns(obsidian)).toEqual([[n1]]);
});

test('navigation hotkeys', async () => {
    const n1 = text();
    await typeText(obsidian, n1);

    await addCardUsingHotkey(obsidian, 'up');
    const n2 = text();
    await typeText(obsidian, n2);

    await addCardUsingHotkey(obsidian, 'up');
    const n3 = text();
    await typeText(obsidian, n3);

    await addCardUsingHotkey(obsidian, 'up');
    const n4 = text();
    await typeText(obsidian, n4);
    await saveCardUsingHotkey(obsidian);

    expect(await getTextsOfColumns(obsidian)).toEqual([[n4, n3, n2, n1]]);

    await addCardUsingHotkey(obsidian, 'right');
    const n5 = text();
    await typeText(obsidian, n5);

    await addCardUsingHotkey(obsidian, 'up');
    const n6 = text();
    await typeText(obsidian, n6);
    await saveCardUsingHotkey(obsidian);

    expect(await getTextsOfColumns(obsidian)).toEqual([
        [n4, n3, n2, n1],
        [n6, n5],
    ]);

    await selectCard(obsidian, 0, 3);
    await addCardUsingHotkey(obsidian, 'right');
    const n7 = text();
    await typeText(obsidian, n7);

    await addCardUsingHotkey(obsidian, 'down');
    const n8 = text();
    await typeText(obsidian, n8);
    await saveCardUsingHotkey(obsidian);
    expect(await getTextsOfColumns(obsidian)).toEqual([
        [n4, n3, n2, n1],
        [n6, n5, n7, n8],
    ]);

    await selectCard(obsidian, 0, 0);
    await navigateUsingHotkey(obsidian, 'down');
    await navigateUsingHotkey(obsidian, 'down');
    const n2_b = text(2);
    const n2_c = `${n2}${n2_b}`;
    await editCardUsingHotkey(obsidian);
    await typeTextAndSaveItUsingHotkey(obsidian, n2_b);
    expect(await getTextsOfColumns(obsidian)).toEqual([
        [n4, n3, n2_c, n1],
        [n6, n5, n7, n8],
    ]);

    await navigateUsingHotkey(obsidian, 'up');
    await navigateUsingHotkey(obsidian, 'up');
    const n4_b = text(4);
    const n4_c = `${n4}${n4_b}`;
    await editCardUsingHotkey(obsidian);
    await typeTextAndSaveItUsingHotkey(obsidian, n4_b);
    expect(await getTextsOfColumns(obsidian)).toEqual([
        [n4_c, n3, n2_c, n1],
        [n6, n5, n7, n8],
    ]);

    await navigateUsingHotkey(obsidian, 'end-of-column');
    const n1_b = text(1);
    const n1_c = `${n1}${n1_b}`;
    await editCardUsingHotkey(obsidian);
    await typeTextAndSaveItUsingHotkey(obsidian, n1_b);
    expect(await getTextsOfColumns(obsidian)).toEqual([
        [n4_c, n3, n2_c, n1_c],
        [n6, n5, n7, n8],
    ]);

    await navigateUsingHotkey(obsidian, 'right');
    await navigateUsingHotkey(obsidian, 'start-of-column');
    await navigateUsingHotkey(obsidian, 'end-of-group');
    const n5_b = text(5);
    const n5_c = `${n5}${n5_b}`;
    await editCardUsingHotkey(obsidian);
    await typeTextAndSaveItUsingHotkey(obsidian, n5_b);
    expect(await getTextsOfColumns(obsidian)).toEqual([
        [n4_c, n3, n2_c, n1_c],
        [n6, n5_c, n7, n8],
    ]);

    await navigateUsingHotkey(obsidian, 'end-of-column');
    await navigateUsingHotkey(obsidian, 'start-of-group');
    const n7_b = text(7);
    const n7_c = `${n7}${n7_b}`;
    await editCardUsingHotkey(obsidian);
    await typeTextAndSaveItUsingHotkey(obsidian, n7_b);
    expect(await getTextsOfColumns(obsidian)).toEqual([
        [n4_c, n3, n2_c, n1_c],
        [n6, n5_c, n7_c, n8],
    ]);

    await navigateUsingHotkey(obsidian, 'start-of-column');
    await navigateUsingHotkey(obsidian, 'left');
    await navigateUsingHotkey(obsidian, 'down');
    const n3_b = text(3);
    const n3_c = `${n3}${n3_b}`;
    await editCardUsingHotkey(obsidian);
    await typeTextAndSaveItUsingHotkey(obsidian, n3_b);
    expect(await getTextsOfColumns(obsidian)).toEqual([
        [n4_c, n3_c, n2_c, n1_c],
        [n6, n5_c, n7_c, n8],
    ]);
});

test('undo redo history', async () => {
    const n1 = text();
    await typeText(obsidian, n1);

    await addCardUsingHotkey(obsidian, 'up');
    const n2 = text();
    await typeText(obsidian, n2);

    await addCardUsingHotkey(obsidian, 'up');
    const n3 = text();
    await typeText(obsidian, n3);

    await addCardUsingHotkey(obsidian, 'up');
    const n4 = text();
    await typeText(obsidian, n4);
    await saveCardUsingHotkey(obsidian);

    expect(await getTextsOfColumns(obsidian)).toEqual([[n4, n3, n2, n1]]);

    await deleteCardUsingHotkey(obsidian);
    expect(await getTextsOfColumns(obsidian)).toEqual([[n3, n2, n1]]);

    await undoChangeUsingHotkey(obsidian);
    expect(await getTextsOfColumns(obsidian)).toEqual([[n4, n3, n2, n1]]);

    await redoChangeUsingHotkey(obsidian);
    expect(await getTextsOfColumns(obsidian)).toEqual([[n3, n2, n1]]);
});

test('search', async () => {
    const n1 = text();
    await typeText(obsidian, n1);

    await addCardUsingHotkey(obsidian, 'up');
    const n2 = text();
    await typeText(obsidian, n2);

    await addCardUsingHotkey(obsidian, 'right');
    const n3 = text();
    await typeText(obsidian, n3);

    await addCardUsingHotkey(obsidian, 'right');
    const n4 = text();
    await typeText(obsidian, n4);
    await saveCardUsingHotkey(obsidian);

    expect(await getTextsOfColumns(obsidian)).toEqual([[n2, n1], [n3], [n4]]);

    await toggleSearchUsingHotkey(obsidian);
    await setSearchQuery(obsidian, '4');

    expect(await getTextsOfColumns(obsidian)).toEqual([[], [], [n4]]);

    await obsidian.keyboard.press('Escape');
    await delay(SHORT);
    expect(await getTextsOfColumns(obsidian)).toEqual([[n2, n1], [n3], [n4]]);
});
