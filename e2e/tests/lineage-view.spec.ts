import { expect, test } from '@playwright/test';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands/close-this-tab-group';
import { createNewLineageFile } from '../helpers/interactions/lineage-commands/create-new-lineage-file';
import { resetTextIndex, text } from '../helpers/general/text';
import { getUndoChangeButton } from '../helpers/getters/lineage-view/history/get-undo-change-button';
import { getRedoChangeButton } from '../helpers/getters/lineage-view/history/get-redo-change-button';
import { typeTextAndSaveItUsingHotkey } from '../helpers/interactions/lineage-card/type-text-and-save-it-using-hotkey';
import { loadObsidian } from '../helpers/getters/obsidian/load-obsidian';
import { undoChangeUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/undo-change-using-hotkey';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/get-texts-of-columns';
import { redoChangeUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/redo-change-using-hotkey';
import { getSnapshotsButton } from '../helpers/getters/lineage-view/history/get-snapshots-button';
import { toggleSnapshotsList } from '../helpers/interactions/lineage-view/history/toggle-snapshots-list';
import { getSnapshotsList } from '../helpers/getters/lineage-view/history/get-snapshots-list';
import { addCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/add-card-using-hotkey';

test.beforeAll(async () => {
    await loadObsidian();
});
test.beforeEach(async () => {
    await closeThisTabGroup();
    await createNewLineageFile();
    resetTextIndex();
});
test.describe('history', () => {
    test('undo and redo buttons should be disabled', async () => {
        expect(await (await getUndoChangeButton()).isDisabled()).toBe(true);
        expect(await (await getRedoChangeButton()).isDisabled()).toBe(true);
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        expect(await (await getUndoChangeButton()).isDisabled()).toBe(false);
        expect(await (await getRedoChangeButton()).isDisabled()).toBe(true);
        expect(await getTextsOfColumns()).toEqual([[n1]]);

        await undoChangeUsingHotkey();
        expect(await (await getUndoChangeButton()).isDisabled()).toBe(true);
        expect(await (await getRedoChangeButton()).isDisabled()).toBe(false);
        expect(await getTextsOfColumns()).toEqual([['']]);

        await redoChangeUsingHotkey();
        expect(await (await getUndoChangeButton()).isDisabled()).toBe(false);
        expect(await (await getRedoChangeButton()).isDisabled()).toBe(true);
        expect(await getTextsOfColumns()).toEqual([[n1]]);
    });

    test('undo and redo change using snapshots list', async () => {
        expect(await (await getSnapshotsButton()).isDisabled()).toBe(false);
        await toggleSnapshotsList();
        const l1 = await getSnapshotsList();
        expect(l1.length).toBe(1);

        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        const l2 = await getSnapshotsList();
        expect(l2.length).toBe(2);

        const n2 = text();
        await addCardUsingHotkey('down');
        await typeTextAndSaveItUsingHotkey(n2);

        const l3 = await getSnapshotsList();
        expect(l3.length).toBe(4);
        expect(await getTextsOfColumns()).toEqual([[n1, n2]]);
        await l3[1].click();
        expect(await getTextsOfColumns()).toEqual([[n1, '']]);
        await l3[2].click();
        expect(await getTextsOfColumns()).toEqual([[n1]]);

        await l3[3].click();
        expect(await getTextsOfColumns()).toEqual([['']]);

        await l3[0].click();
        expect(await getTextsOfColumns()).toEqual([[n1, n2]]);
    });

    test('obsolete snapshots should be deleted', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        const n2 = text();
        await addCardUsingHotkey('down');
        await typeTextAndSaveItUsingHotkey(n2);

        const n3 = text();
        await addCardUsingHotkey('right');
        await typeTextAndSaveItUsingHotkey(n3);

        const n4 = text();
        await addCardUsingHotkey('down');
        await typeTextAndSaveItUsingHotkey(n4);

        const n5 = text();
        await addCardUsingHotkey('right');
        await typeTextAndSaveItUsingHotkey(n5);

        expect(await getTextsOfColumns()).toEqual([[n1, n2], [n3, n4], [n5]]);

        await toggleSnapshotsList();
        const l1 = await getSnapshotsList();
        expect(l1.length).toBe(10);
        await l1[4].click();
        expect(await getTextsOfColumns()).toEqual([[n1, n2], [n3]]);

        await l1[2].click();
        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n3, n4],
        ]);

        await l1[0].click();
        expect(await getTextsOfColumns()).toEqual([[n1, n2], [n3, n4], [n5]]);

        await l1[4].click();
        expect(await getTextsOfColumns()).toEqual([[n1, n2], [n3]]);

        // new history branch
        const n6 = text();
        await addCardUsingHotkey('up');
        await typeTextAndSaveItUsingHotkey(n6);
        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n6, n3],
        ]);

        const l2 = await getSnapshotsList();
        expect(l2.length).toBe(8);

        await l2[2].click();
        expect(await getTextsOfColumns()).toEqual([[n1, n2], [n3]]);

        await l2[0].click();
        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n6, n3],
        ]);
    });
});
