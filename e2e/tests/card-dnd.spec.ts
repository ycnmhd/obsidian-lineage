import { expect, test } from '@playwright/test';
import { loadObsidian } from '../helpers/getters/obsidian/load-obsidian';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands/close-this-tab-group';
import { createNewLineageFile } from '../helpers/interactions/lineage-commands/create-new-lineage-file';
import { resetTextIndex, text } from '../helpers/general/text';
import { typeText } from '../helpers/interactions/lineage-card/type-text';
import { addCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/add-card-using-hotkey';
import { saveCardUsingHotkey } from '../helpers/interactions/lineage-view-hotkeys/save-card-using-hotkey';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/get-texts-of-columns';
import { selectCard } from '../helpers/interactions/lineage-card/select-card';
import { getCardId } from '../helpers/getters/lineage-view/get-card.id';
import { dragAndDropBelow } from '../helpers/interactions/dom/drag-and-drop-below';

test.beforeAll(async () => {
    await loadObsidian();
});
test.beforeEach(async () => {
    await closeThisTabGroup();
    await createNewLineageFile();
    resetTextIndex();
});

test('drag and drop', async () => {
    const n1 = text();
    const n2 = text();
    const n3 = text();
    const n4 = text();
    const n5 = text();
    const n6 = text();
    const n7 = text();
    const n8 = text();

    await typeText(n1);

    await addCardUsingHotkey('down');
    await typeText(n2);

    await addCardUsingHotkey('right');
    await typeText(n3);

    await addCardUsingHotkey('down');
    await typeText(n4);

    await addCardUsingHotkey('right');
    await typeText(n5);

    await addCardUsingHotkey('right');
    await typeText(n6);
    await saveCardUsingHotkey();

    expect(await getTextsOfColumns()).toEqual([[n1, n2], [n3, n4], [n5], [n6]]);
    await selectCard(1, 0);

    await addCardUsingHotkey('right');
    await typeText(n7);

    await addCardUsingHotkey('right');
    await typeText(n8);
    await saveCardUsingHotkey();

    expect(await getTextsOfColumns()).toEqual([
        [n1, n2],
        [n3, n4],
        [n7, n5],
        [n8, n6],
    ]);

    const n4Card = await getCardId(1, 1);
    const n1Card = await getCardId(0, 0);

    await dragAndDropBelow(n4Card, n1Card);
    expect(await getTextsOfColumns()).toEqual([
        [n1, n4, n2],
        [n5, n3],
        [n6, n7],
        [n8],
    ]);

    const n2Card = await getCardId(0, 2);
    await dragAndDropBelow(n2Card, n1Card);

    expect(await getTextsOfColumns()).toEqual([
        [n1, n2, n4],
        [n3, n5],
        [n7, n6],
        [n8],
    ]);

    const n3Card = await getCardId(1, 0);
    await dragAndDropBelow(n3Card, n4Card);
    expect(await getTextsOfColumns()).toEqual([
        [n1, n2, n4, n3],
        [n5, n7],
        [n6, n8],
    ]);
});
