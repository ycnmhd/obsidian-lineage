import { expect, test } from '../helpers/base-test';
import { addCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/add-card-using-hotkey';
import { createNewLineageFile } from '../helpers/interactions/lineage-commands/create-new-lineage-file';
import {
    typeText,
    typeTextWithoutClick,
} from '../helpers/interactions/lineage-view/card/type-text';
import { moveCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/move-card-using-hotkey';
import { saveCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/save-card-using-hotkey';
import { text } from '../helpers/general/text';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/card/get-texts-of-columns';
import { closeThisTab } from '../helpers/interactions/obsidian-commands/close-this-tab';
import { undoCloseTab } from '../helpers/interactions/obsidian-commands/undo-close-tab';
import { goToTab } from '../helpers/interactions/obsidian-commands/go-to-tab';
import { editCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/edit-card-using-hotkey';
import { navigateUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/navigate-using-hotkey';
import { selectCard } from '../helpers/interactions/lineage-view/card/select-card';
import { deleteCardUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/delete-card-using-hotkey';
import { discardChangesUsingHotkey } from '../helpers/interactions/lineage-view/hotkeys/discard-changes-using-hotkey';
import { typeTextAndSaveItUsingHotkey } from '../helpers/interactions/lineage-view/card/type-text-and-save-it-using-hotkey';
import { undoChangeUsingButton } from '../helpers/interactions/lineage-view/history/undo-change-using-button';
import { redoChangeUsingButton } from '../helpers/interactions/lineage-view/history/redo-change-using-button';

test.describe('text should be saved', () => {
    test('should save card when view is closed', async () => {
        const n1 = text();
        await typeText(n1);

        await closeThisTab();
        await undoCloseTab();

        expect(await getTextsOfColumns()).toEqual([[n1]]);
    });

    test('should save node before moving it', async () => {
        // create a card
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        await addCardUsingHotkey('down');
        const n2 = text();
        await typeText(n2);

        // move card before saving
        await moveCardUsingHotkey('right');

        expect(await getTextsOfColumns()).toEqual([[n1], [n2]]);
    });

    test('should save node when a different node is selected', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        await addCardUsingHotkey('right');
        const n2 = text();
        await typeText(n2);

        // select a different card before saving
        await selectCard(0, 0);

        expect(await getTextsOfColumns()).toEqual([[n1], [n2]]);
    });
});

test.describe('some hotkeys should not work', () => {
    test('deletion hotkeys should not work while editing', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        await addCardUsingHotkey('right');
        const n2 = text();
        await typeTextAndSaveItUsingHotkey(n2);

        expect(await getTextsOfColumns()).toEqual([[n1], [n2]]);

        await editCardUsingHotkey();
        await deleteCardUsingHotkey();

        await discardChangesUsingHotkey();

        expect(await getTextsOfColumns()).toEqual([[n1], [n2]]);

        await deleteCardUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([[n1]]);
    });

    test('navigation hotkeys should not work while editing', async () => {
        const n1 = text();
        await typeTextWithoutClick(n1);
        await saveCardUsingHotkey();

        await addCardUsingHotkey('down');
        const n2 = text();
        await typeTextWithoutClick(n2);
        await saveCardUsingHotkey();

        await addCardUsingHotkey('right');
        const n3 = text();
        await typeTextWithoutClick(n3);
        await saveCardUsingHotkey();

        await addCardUsingHotkey('down');
        const n4 = text();
        await typeTextWithoutClick(n4);
        await saveCardUsingHotkey();

        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n3, n4],
        ]);

        await editCardUsingHotkey();
        await navigateUsingHotkey('up');
        await typeTextWithoutClick('1');

        await navigateUsingHotkey('down');
        await typeTextWithoutClick('2');

        await saveCardUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n3, `1${n4}2`],
        ]);

        await editCardUsingHotkey();
        await navigateUsingHotkey('left');
        await typeTextWithoutClick('3');

        await navigateUsingHotkey('right');
        await typeTextWithoutClick('4');

        await saveCardUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n3, `1${n4}324`],
        ]);

        await editCardUsingHotkey();
        await navigateUsingHotkey('start-of-column');
        await typeTextWithoutClick('6');

        await navigateUsingHotkey('end-of-column');
        await typeTextWithoutClick('7');

        await saveCardUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n3, `61${n4}3247`],
        ]);

        await editCardUsingHotkey();
        await navigateUsingHotkey('start-of-group');
        await typeTextWithoutClick('8');

        await navigateUsingHotkey('end-of-group');
        await typeTextWithoutClick('9');

        await saveCardUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n3, `861${n4}32479`],
        ]);
    });

    test('history should not work while editing', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        await addCardUsingHotkey('down');
        const n2 = text();
        await typeTextAndSaveItUsingHotkey(n2);

        await addCardUsingHotkey('right');
        const n3 = text();
        await typeTextAndSaveItUsingHotkey(n3);

        await addCardUsingHotkey('down');
        const n4 = text();
        await typeTextAndSaveItUsingHotkey(n4);

        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n3, n4],
        ]);

        await editCardUsingHotkey();
        await typeText('1');

        // undo should not work
        await undoChangeUsingButton();
        await saveCardUsingHotkey();
        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n3, n4 + '1'],
        ]);

        await undoChangeUsingButton();
        await editCardUsingHotkey();
        // redo should not work
        await redoChangeUsingButton();
        await typeTextAndSaveItUsingHotkey('2');

        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n3, n4 + '2'],
        ]);
    });
});

test('should handle multiple text areas in parallel', async () => {
    const n1 = text();
    await typeText(n1);

    // create file 2
    await createNewLineageFile();

    const n2 = text();
    await typeText(n2);

    // go to f1
    await goToTab(1);
    await saveCardUsingHotkey();
    expect(await getTextsOfColumns()).toEqual([[n1]]);

    // go to f2
    await goToTab(2);
    await saveCardUsingHotkey();
    expect(await getTextsOfColumns()).toEqual([[n2]]);
});
