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
import { getNavigateBackButton } from '../helpers/getters/lineage-view/navigation/get-navigate-back-button';
import { getNavigateForwardButton } from '../helpers/getters/lineage-view/navigation/get-navigate-forward-button';
import { navigateBackUsingButton } from '../helpers/interactions/lineage-view/navigation/navigate-back-using-button';
import { editCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/edit-card-using-hotkey';
import { navigateForwardUsingButton } from '../helpers/interactions/lineage-view/navigation/navigate-forward-using-button';
import { deleteCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/delete-card-using-hotkey';
import { getBreadcrumbs } from '../helpers/getters/lineage-view/breadcrumbs/get-breadcrumbs';
import { getBreadcrumbsText } from '../helpers/getters/lineage-view/breadcrumbs/get-breadcrumbs-text';
import { clickBreadcrumbsItem } from '../helpers/interactions/lineage-view/breadcrumbs/click-breadcrumbs-item';
import { selectCard } from '../helpers/interactions/lineage-card/select-card';

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

test.describe('navigation', () => {
    const backDisabled = async () =>
        await (await getNavigateBackButton()).isDisabled();
    const forwardDisabled = async () =>
        await (await getNavigateForwardButton()).isDisabled();
    test('basic', async () => {
        const n1 = text();
        await typeTextAndSaveItUsingHotkey(n1);

        expect(await backDisabled()).toBe(true);
        expect(await forwardDisabled()).toBe(true);
        const n2 = text();
        await addCardUsingHotkey('down');
        await typeTextAndSaveItUsingHotkey(n2);

        expect(await backDisabled()).toBe(false);
        expect(await forwardDisabled()).toBe(true);

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

        await navigateBackUsingButton();
        expect(await backDisabled()).toBe(false);
        expect(await forwardDisabled()).toBe(false);

        const n4_b = text(4);
        const n4_c = n4 + n4_b;
        await editCardUsingHotkey();
        await typeTextAndSaveItUsingHotkey(n4_b);
        expect(await getTextsOfColumns()).toEqual([[n1, n2], [n3, n4_c], [n5]]);

        await navigateBackUsingButton();
        const n3_b = text(3);
        const n3_c = n3 + n3_b;
        await editCardUsingHotkey();
        await typeTextAndSaveItUsingHotkey(n3_b);
        expect(await getTextsOfColumns()).toEqual([
            [n1, n2],
            [n3_c, n4_c],
            [n5],
        ]);

        await navigateBackUsingButton();
        await navigateBackUsingButton();
        expect(await backDisabled()).toBe(true);
        expect(await forwardDisabled()).toBe(false);

        await navigateForwardUsingButton();
        const n2_b = text(2);
        const n2_c = n2 + n2_b;
        await editCardUsingHotkey();
        await typeTextAndSaveItUsingHotkey(n2_b);
        expect(await getTextsOfColumns()).toEqual([
            [n1, n2_c],
            [n3_c, n4_c],
            [n5],
        ]);

        await deleteCardUsingHotkey();
        const n1_b = text(1);
        const n1_c = n1 + n1_b;
        await editCardUsingHotkey();
        await typeTextAndSaveItUsingHotkey(n1_b);
        expect(await getTextsOfColumns()).toEqual([[n1_c]]);
        expect(await backDisabled()).toBe(true);
        expect(await forwardDisabled()).toBe(true);
    });
});

test('breadcrumbs', async () => {
    const n1 = text();
    await typeTextAndSaveItUsingHotkey(n1);

    expect((await getBreadcrumbs()).length).toBe(0);

    const n2 = text();
    await addCardUsingHotkey('down');
    await typeTextAndSaveItUsingHotkey(n2);

    expect((await getBreadcrumbs()).length).toBe(0);
    const n3 = text();
    await addCardUsingHotkey('right');
    await typeTextAndSaveItUsingHotkey(n3);
    expect((await getBreadcrumbs()).length).toBe(1);

    const n4 = text();
    await addCardUsingHotkey('right');
    await typeTextAndSaveItUsingHotkey(n4);
    expect((await getBreadcrumbs()).length).toBe(2);
    const n5 = text();
    await addCardUsingHotkey('right');
    await typeTextAndSaveItUsingHotkey(n5);
    expect((await getBreadcrumbs()).length).toBe(3);

    expect(await getTextsOfColumns()).toEqual([[n1, n2], [n3], [n4], [n5]]);

    expect(await getBreadcrumbsText()).toEqual([n2, n3, n4]);

    await clickBreadcrumbsItem(1);
    expect(await getBreadcrumbsText()).toEqual([n2]);

    const n3_b = text(3);
    const n3_c = n3 + n3_b;
    await editCardUsingHotkey();
    await typeTextAndSaveItUsingHotkey(n3_b);
    expect(await getTextsOfColumns()).toEqual([[n1, n2], [n3_c], [n4], [n5]]);

    await selectCard(3, 0);
    expect(await getBreadcrumbsText()).toEqual([n2, n3_c, n4]);
});
