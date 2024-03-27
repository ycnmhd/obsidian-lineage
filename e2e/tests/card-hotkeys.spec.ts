import { expect, test } from '../helpers/base-test';
import { addCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/add-card-using-hotkey';
import { text } from '../helpers/general/text';
import { typeText } from '../helpers/interactions/lineage-view/card/type-text';
import { editCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/edit-card-using-hotkey';
import { discardChangesUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/discard-changes-using-hotkey';
import { saveCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/save-card-using-hotkey';
import { addCardAndSplitAtCursorUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/add-card-and-split-at-cursor-using-hotkey';
import { repeatPressKey } from '../helpers/interactions/dom/repeat-press-key';
import { selectCard } from '../helpers/interactions/lineage-view/card/select-card';
import { moveCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/move-card-using-hotkey';
import { mergeCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/merge-card-using-hotkey';
import { deleteCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/delete-card-using-hotkey';
import { navigateUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/navigate-using-hotkey';
import { typeTextAndSaveItUsingHotkey } from '../helpers/interactions/lineage-view/card/type-text-and-save-it-using-hotkey';
import { undoChangeUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/undo-change-using-hotkey';
import { redoChangeUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/redo-change-using-hotkey';
import { toggleSearchUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/toggle-search-using-hotkey';
import { setSearchQuery } from '../helpers/interactions/lineage-view/search/set-search-query';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/card/get-texts-of-columns';
import { discardInputChanges } from '../helpers/interactions/lineage-view/hotkeys/discard-input-changes';

test.describe('card hotkeys', () => {
    test('save card, edit card and discard changes using hotkey', async () => {
        const n1 = text();
        await typeText(n1);
        await saveCardUsingHotkey();

        const n1_b = text(1);
        await editCardUsingHotkey();
        await typeText(n1_b);
        await saveCardUsingHotkey();

        const n1_c = text(1);
        await editCardUsingHotkey();
        await typeText(n1_c);
        await discardChangesUsingHotkey();

        expect(await getTextsOfColumns()).toEqual([[n1 + n1_b]]);
    });

    test('create cards using hotkeys', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        await addCardUsingHotkey('up');
        const n2 = text();
        await typeTextAndSaveItUsingHotkey(n2);

        await addCardUsingHotkey('down');
        const n3 = text();
        await typeTextAndSaveItUsingHotkey(n3);

        await addCardUsingHotkey('right');
        const n4 = text();
        await typeTextAndSaveItUsingHotkey(n4);

        const cs = await getTextsOfColumns();
        expect(cs).toEqual([[n2, n3, n1], [n4]]);
    });

    test('create cards and split at cursor using hotkeys', async () => {
        const n1 = text();
        await typeText(n1);
        const n2 = text();
        await typeText(n2);

        await repeatPressKey('ArrowLeft', n2.length);
        await addCardAndSplitAtCursorUsingHotkey('up');
        const n3 = text();
        await typeText(n3);

        await repeatPressKey('ArrowLeft', n3.length);
        await addCardAndSplitAtCursorUsingHotkey('down');
        const n4 = text();
        await typeText(n4);

        await repeatPressKey('ArrowLeft', n4.length);
        await addCardAndSplitAtCursorUsingHotkey('right');
        await saveCardUsingHotkey();

        const cs = await getTextsOfColumns();
        expect(cs).toEqual([[n1, n3, n2], [n4]]);
    });

    test('move card', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        const n2 = text();
        await addCardUsingHotkey('up');
        await typeTextAndSaveItUsingHotkey(n2);

        const n3 = text();
        await addCardUsingHotkey('up');
        await typeTextAndSaveItUsingHotkey(n3);

        const n4 = text();
        await addCardUsingHotkey('up');
        await typeTextAndSaveItUsingHotkey(n4);

        expect(await getTextsOfColumns()).toEqual([[n4, n3, n2, n1]]);

        await selectCard(0, 3);
        await moveCardUsingHotkey('up');
        expect(await getTextsOfColumns()).toEqual([[n4, n3, n1, n2]]);

        await moveCardUsingHotkey('up');
        expect(await getTextsOfColumns()).toEqual([[n4, n1, n3, n2]]);

        await selectCard(0, 0);
        await moveCardUsingHotkey('down');
        expect(await getTextsOfColumns()).toEqual([[n1, n4, n3, n2]]);

        await selectCard(0, 3);
        await moveCardUsingHotkey('right');
        expect(await getTextsOfColumns()).toEqual([[n1, n4, n3], [n2]]);

        await selectCard(0, 1);
        await moveCardUsingHotkey('right');
        await moveCardUsingHotkey('right');
        expect(await getTextsOfColumns()).toEqual([[n1, n3], [n2], [n4]]);

        await selectCard(2, 0);
        await moveCardUsingHotkey('left');
        expect(await getTextsOfColumns()).toEqual([
            [n1, n3],
            [n2, n4],
        ]);

        await selectCard(1, 0);
        await moveCardUsingHotkey('left');
        expect(await getTextsOfColumns()).toEqual([[n1, n3, n2], [n4]]);
    });

    test('merge node', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        const n2 = text();
        await addCardUsingHotkey('up');
        await typeTextAndSaveItUsingHotkey(n2);

        const n3 = text();
        await addCardUsingHotkey('up');
        await typeTextAndSaveItUsingHotkey(n3);

        const n4 = text();
        await addCardUsingHotkey('up');
        await typeTextAndSaveItUsingHotkey(n4);

        expect(await getTextsOfColumns()).toEqual([[n4, n3, n2, n1]]);

        await mergeCardUsingHotkey('up');
        expect(await getTextsOfColumns()).toEqual([[n4, n3, n2, n1]]);

        await mergeCardUsingHotkey('down');
        const n4_n3 = `${n4}\n${n3}`;
        expect(await getTextsOfColumns()).toEqual([[n4_n3, n2, n1]]);

        await selectCard(0, 2);
        await mergeCardUsingHotkey('down');
        expect(await getTextsOfColumns()).toEqual([[n4_n3, n2, n1]]);

        await mergeCardUsingHotkey('up');
        const n2_n1 = `${n2}\n${n1}`;
        expect(await getTextsOfColumns()).toEqual([[n4_n3, n2_n1]]);
    });

    test('delete cards using hotkey', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        await addCardUsingHotkey('up');
        const n2 = text();
        await typeTextAndSaveItUsingHotkey(n2);

        await addCardUsingHotkey('down');
        const n3 = text();
        await typeTextAndSaveItUsingHotkey(n3);

        await addCardUsingHotkey('right');
        const n4 = text();
        await typeTextAndSaveItUsingHotkey(n4);

        expect(await getTextsOfColumns()).toEqual([[n2, n3, n1], [n4]]);

        await selectCard(0, 1);
        await deleteCardUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([[n2, n1]]);

        await deleteCardUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([[n1]]);

        await deleteCardUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([[n1]]);
    });

    test('navigation hotkeys', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        await addCardUsingHotkey('up');
        const n2 = text();
        await typeTextAndSaveItUsingHotkey(n2);

        await addCardUsingHotkey('up');
        const n3 = text();
        await typeTextAndSaveItUsingHotkey(n3);

        await addCardUsingHotkey('up');
        const n4 = text();
        await typeTextAndSaveItUsingHotkey(n4);

        expect(await getTextsOfColumns()).toEqual([[n4, n3, n2, n1]]);

        await addCardUsingHotkey('right');
        const n5 = text();
        await typeTextAndSaveItUsingHotkey(n5);

        await addCardUsingHotkey('up');
        const n6 = text();
        await typeTextAndSaveItUsingHotkey(n6);

        expect(await getTextsOfColumns()).toEqual([
            [n4, n3, n2, n1],
            [n6, n5],
        ]);

        await selectCard(0, 3);
        await addCardUsingHotkey('right');
        const n7 = text();
        await typeTextAndSaveItUsingHotkey(n7);

        await addCardUsingHotkey('down');
        const n8 = text();
        await typeTextAndSaveItUsingHotkey(n8);
        expect(await getTextsOfColumns()).toEqual([
            [n4, n3, n2, n1],
            [n6, n5, n7, n8],
        ]);

        await selectCard(0, 0);
        await navigateUsingHotkey('down');
        await navigateUsingHotkey('down');
        const n2_b = text(2);
        const n2_c = `${n2}${n2_b}`;
        await editCardUsingHotkey();
        await typeTextAndSaveItUsingHotkey(n2_b);
        expect(await getTextsOfColumns()).toEqual([
            [n4, n3, n2_c, n1],
            [n6, n5, n7, n8],
        ]);

        await navigateUsingHotkey('up');
        await navigateUsingHotkey('up');
        const n4_b = text(4);
        const n4_c = `${n4}${n4_b}`;
        await editCardUsingHotkey();
        await typeTextAndSaveItUsingHotkey(n4_b);
        expect(await getTextsOfColumns()).toEqual([
            [n4_c, n3, n2_c, n1],
            [n6, n5, n7, n8],
        ]);

        await navigateUsingHotkey('end-of-column');
        const n1_b = text(1);
        const n1_c = `${n1}${n1_b}`;
        await editCardUsingHotkey();
        await typeTextAndSaveItUsingHotkey(n1_b);
        expect(await getTextsOfColumns()).toEqual([
            [n4_c, n3, n2_c, n1_c],
            [n6, n5, n7, n8],
        ]);

        await navigateUsingHotkey('right');
        await navigateUsingHotkey('start-of-column');
        await navigateUsingHotkey('end-of-group');
        const n5_b = text(5);
        const n5_c = `${n5}${n5_b}`;
        await editCardUsingHotkey();
        await typeTextAndSaveItUsingHotkey(n5_b);
        expect(await getTextsOfColumns()).toEqual([
            [n4_c, n3, n2_c, n1_c],
            [n6, n5_c, n7, n8],
        ]);

        await navigateUsingHotkey('end-of-column');
        await navigateUsingHotkey('start-of-group');
        const n7_b = text(7);
        const n7_c = `${n7}${n7_b}`;
        await editCardUsingHotkey();
        await typeTextAndSaveItUsingHotkey(n7_b);
        expect(await getTextsOfColumns()).toEqual([
            [n4_c, n3, n2_c, n1_c],
            [n6, n5_c, n7_c, n8],
        ]);

        await navigateUsingHotkey('start-of-column');
        await navigateUsingHotkey('left');
        await navigateUsingHotkey('down');
        const n3_b = text(3);
        const n3_c = `${n3}${n3_b}`;
        await editCardUsingHotkey();
        await typeTextAndSaveItUsingHotkey(n3_b);
        expect(await getTextsOfColumns()).toEqual([
            [n4_c, n3_c, n2_c, n1_c],
            [n6, n5_c, n7_c, n8],
        ]);
    });

    test('undo redo history', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        await addCardUsingHotkey('up');
        const n2 = text();
        await typeTextAndSaveItUsingHotkey(n2);

        await addCardUsingHotkey('up');
        const n3 = text();
        await typeTextAndSaveItUsingHotkey(n3);

        await addCardUsingHotkey('up');
        const n4 = text();
        await typeTextAndSaveItUsingHotkey(n4);

        expect(await getTextsOfColumns()).toEqual([[n4, n3, n2, n1]]);

        await deleteCardUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([[n3, n2, n1]]);

        await undoChangeUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([[n4, n3, n2, n1]]);

        await redoChangeUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([[n3, n2, n1]]);
    });

    test('search', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        await addCardUsingHotkey('up');
        const n2 = text();
        await typeTextAndSaveItUsingHotkey(n2);

        await addCardUsingHotkey('right');
        const n3 = text();
        await typeTextAndSaveItUsingHotkey(n3);

        await addCardUsingHotkey('right');
        const n4 = text();
        await typeTextAndSaveItUsingHotkey(n4);

        expect(await getTextsOfColumns()).toEqual([[n2, n1], [n3], [n4]]);

        await toggleSearchUsingHotkey();
        await setSearchQuery('4');

        expect(await getTextsOfColumns()).toEqual([[], [], [n4]]);

        await discardInputChanges();
        expect(await getTextsOfColumns()).toEqual([[n2, n1], [n3], [n4]]);
    });
});
