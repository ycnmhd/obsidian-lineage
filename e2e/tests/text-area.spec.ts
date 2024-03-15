import { expect, Page, test } from '@playwright/test';
import { getObsidian } from '../helpers/getters/obsidian';
import { addCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/add-card-using-hotkey';
import { createNewLineageFile } from '../helpers/interactions/lineage-commands/create-new-lineage-file';
import { typeText } from '../helpers/interactions/lineage-card/type-text';
import { moveCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/move-card-using-hotkey';
import { saveCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/save-card-using-hotkey';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands/close-this-tab-group';
import { resetTextIndex, text } from '../helpers/general/helpers';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/get-texts-of-columns';
import { closeThisTab } from '../helpers/interactions/obsidian-commands/close-this-tab';
import { undoCloseTab } from '../helpers/interactions/obsidian-commands/undo-close-tab';
import { goToTab } from '../helpers/interactions/obsidian-commands/go-to-tab';
import { editCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/edit-card-using-hotkey';
import { navigateUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/navigate-using-hotkey';
import { undoChangeUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/undo-change-using-hotkey';
import { redoChangeUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/redo-change-using-hotkey';
import { selectCard } from '../helpers/interactions/lineage-card/select-card';
import { deleteCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/delete-card-using-hotkey';
import { discardChangesUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/discard-changes-using-hotkey';

let obsidian: Page;

test.beforeAll(async () => {
    obsidian = await getObsidian();
});
test.beforeEach(async () => {
    await closeThisTabGroup(obsidian);
    await createNewLineageFile(obsidian);
    resetTextIndex();
});

test.describe('text should be saved', () => {
    test('should save card when view is closed', async () => {
        const n1 = text();
        await typeText(obsidian, n1);

        await closeThisTab(obsidian);
        await undoCloseTab(obsidian);

        expect(await getTextsOfColumns(obsidian)).toEqual([[n1]]);
    });

    test('should save node before moving it', async () => {
        // create a card
        const n1 = text();
        await typeText(obsidian, n1);

        await addCardUsingHotkey(obsidian, 'down');
        const n2 = text();
        await typeText(obsidian, n2);

        // move card before saving
        await moveCardUsingHotkey(obsidian, 'right');

        expect(await getTextsOfColumns(obsidian)).toEqual([[n1], [n2]]);
    });

    test('should save node when a different node is selected', async () => {
        const n1 = text();
        await typeText(obsidian, n1);

        await addCardUsingHotkey(obsidian, 'right');
        const n2 = text();
        await typeText(obsidian, n2);

        // select a different card before saving
        await selectCard(obsidian, 0, 0);

        expect(await getTextsOfColumns(obsidian)).toEqual([[n1], [n2]]);
    });
});

test.describe('some hotkeys should not work', () => {
    test('deletion hotkeys should not work while editing', async () => {
        const n1 = text();
        await typeText(obsidian, n1);

        await addCardUsingHotkey(obsidian, 'right');
        const n2 = text();
        await typeText(obsidian, n2);
        await saveCardUsingHotkey(obsidian);

        expect(await getTextsOfColumns(obsidian)).toEqual([[n1], [n2]]);

        await editCardUsingHotkey(obsidian);
        await deleteCardUsingHotkey(obsidian);

        await discardChangesUsingHotkey(obsidian);

        expect(await getTextsOfColumns(obsidian)).toEqual([[n1], [n2]]);

        await deleteCardUsingHotkey(obsidian);
        expect(await getTextsOfColumns(obsidian)).toEqual([[n1]]);
    });

    test('navigation hotkeys should not work while editing', async () => {
        const n1 = text();
        await typeText(obsidian, n1);

        await addCardUsingHotkey(obsidian, 'down');
        const n2 = text();
        await typeText(obsidian, n2);

        await addCardUsingHotkey(obsidian, 'right');
        const n3 = text();
        await typeText(obsidian, n3);

        await addCardUsingHotkey(obsidian, 'down');
        const n4 = text();
        await typeText(obsidian, n4);

        await saveCardUsingHotkey(obsidian);
        expect(await getTextsOfColumns(obsidian)).toEqual([
            [n1, n2],
            [n3, n4],
        ]);

        await editCardUsingHotkey(obsidian);
        await navigateUsingHotkey(obsidian, 'up');
        await typeText(obsidian, '1');

        await navigateUsingHotkey(obsidian, 'down');
        await typeText(obsidian, '2');

        await saveCardUsingHotkey(obsidian);
        expect(await getTextsOfColumns(obsidian)).toEqual([
            [n1, n2],
            [n3, `1${n4}2`],
        ]);

        await editCardUsingHotkey(obsidian);
        await navigateUsingHotkey(obsidian, 'left');
        await typeText(obsidian, '3');

        await navigateUsingHotkey(obsidian, 'right');
        await typeText(obsidian, '4');

        await saveCardUsingHotkey(obsidian);
        expect(await getTextsOfColumns(obsidian)).toEqual([
            [n1, n2],
            [n3, `1${n4}324`],
        ]);

        await editCardUsingHotkey(obsidian);
        await navigateUsingHotkey(obsidian, 'start-of-column');
        await typeText(obsidian, '6');

        await navigateUsingHotkey(obsidian, 'end-of-column');
        await typeText(obsidian, '7');

        await saveCardUsingHotkey(obsidian);
        expect(await getTextsOfColumns(obsidian)).toEqual([
            [n1, n2],
            [n3, `61${n4}3247`],
        ]);

        await editCardUsingHotkey(obsidian);
        await navigateUsingHotkey(obsidian, 'start-of-group');
        await typeText(obsidian, '8');

        await navigateUsingHotkey(obsidian, 'end-of-group');
        await typeText(obsidian, '9');

        await saveCardUsingHotkey(obsidian);
        expect(await getTextsOfColumns(obsidian)).toEqual([
            [n1, n2],
            [n3, `861${n4}32479`],
        ]);
    });

    test('history should not work while editing', async () => {
        const n1 = text();
        await typeText(obsidian, n1);

        await addCardUsingHotkey(obsidian, 'down');
        const n2 = text();
        await typeText(obsidian, n2);

        await addCardUsingHotkey(obsidian, 'right');
        const n3 = text();
        await typeText(obsidian, n3);

        await addCardUsingHotkey(obsidian, 'down');
        const n4 = text();
        await typeText(obsidian, n4);

        await saveCardUsingHotkey(obsidian);
        expect(await getTextsOfColumns(obsidian)).toEqual([
            [n1, n2],
            [n3, n4],
        ]);

        await editCardUsingHotkey(obsidian);
        await typeText(obsidian, '1');

        // undo should not work
        await undoChangeUsingHotkey(obsidian);
        await saveCardUsingHotkey(obsidian);
        expect(await getTextsOfColumns(obsidian)).toEqual([
            [n1, n2],
            [n3, n4 + '1'],
        ]);

        await undoChangeUsingHotkey(obsidian);
        await editCardUsingHotkey(obsidian);
        // redo should not work
        await redoChangeUsingHotkey(obsidian);
        await typeText(obsidian, '2');

        await saveCardUsingHotkey(obsidian);
        expect(await getTextsOfColumns(obsidian)).toEqual([
            [n1, n2],
            [n3, n4 + '2'],
        ]);
    });
});

test('should handle multiple text areas in parallel', async () => {
    const n1 = text();
    await typeText(obsidian, n1);

    // create file 2
    await createNewLineageFile(obsidian);

    const n2 = text();
    await typeText(obsidian, n2);

    // go to f1
    await goToTab(obsidian, 1);
    await saveCardUsingHotkey(obsidian);
    expect(await getTextsOfColumns(obsidian)).toEqual([[n1]]);

    // go to f2
    await goToTab(obsidian, 2);
    await saveCardUsingHotkey(obsidian);
    expect(await getTextsOfColumns(obsidian)).toEqual([[n2]]);
});
