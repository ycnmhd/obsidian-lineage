import { expect, Page, test } from '@playwright/test';
import { getObsidian } from '../helpers/getters/obsidian';
import { createNewLineageFile } from '../helpers/interactions/lineage-commands/create-new-lineage-file';
import { typeText } from '../helpers/interactions/lineage-card/type-text';
import { typeTextAndSaveItUsingHotkey } from '../helpers/interactions/lineage-card/type-text-and-save-it-using-hotkey';
import { createCardUsingButton } from '../helpers/interactions/lineage-card/create-card-using-button';
import { deleteCardUsingButton } from '../helpers/interactions/lineage-card/delete-card-using-button';
import { selectCard } from '../helpers/interactions/lineage-card/select-card';
import { toggleCardEditUsingButton } from '../helpers/interactions/lineage-card/toggle-card-edit-using-button';
import { saveCardUsingButton } from '../helpers/interactions/lineage-card/save-card-using-button';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands/close-this-tab-group';
import { getCardText } from '../helpers/getters/lineage-view/get-card-text';
import { getCardsOfColumns } from '../helpers/getters/lineage-view/get-cards-of-columns';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/get-texts-of-columns';
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
test.describe('card buttons', () => {
    test('create card above using card button', async () => {
        const n1_text = 'file 1 text 1 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n1_text);

        await createCardUsingButton(obsidian, 'above');
        const n2_text = 'file 1 text 2 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n2_text);

        await selectCard(obsidian, 0, 1);

        await createCardUsingButton(obsidian, 'above');
        const n3_text = 'file 1 text 3 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n3_text);

        const cs = await getTextsOfColumns(obsidian);
        expect(cs).toEqual([[n2_text, n3_text, n1_text]]);
    });

    test('create card below using card button', async () => {
        const n1_text = 'file 1 text 1 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n1_text);

        await createCardUsingButton(obsidian, 'below');
        const n2_text = 'file 1 text 2 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n2_text);

        await selectCard(obsidian, 0, 0);

        await createCardUsingButton(obsidian, 'below');
        const n3_text = 'file 1 text 3 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n3_text);

        // verify structure
        const c1 = (await getCardsOfColumns(obsidian))[0];
        expect(await getCardText(c1[0])).toBe(n1_text);
        expect(await getCardText(c1[1])).toBe(n3_text);
        expect(await getCardText(c1[2])).toBe(n2_text);
        const cs = await getTextsOfColumns(obsidian);
        expect(cs).toEqual([[n1_text, n3_text, n2_text]]);
    });

    test('create child card using card button', async () => {
        const n1_text = 'file 1 text 1 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n1_text);

        await createCardUsingButton(obsidian, 'child');
        const n2_text = 'file 1 text 2 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n2_text);

        await selectCard(obsidian, 0, 0);

        await createCardUsingButton(obsidian, 'child');
        const n3_text = 'file 1 text 3 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n3_text);

        const cs = await getTextsOfColumns(obsidian);
        expect(cs).toEqual([[n1_text], [n2_text, n3_text]]);
    });

    test('delete card using card button', async () => {
        const n1_text = 'n1 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n1_text);

        await createCardUsingButton(obsidian, 'below');
        const n2_text = 'n2 below n1 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n2_text);

        await selectCard(obsidian, 0, 0);

        await createCardUsingButton(obsidian, 'child');
        const n3_text = 'n3 child of n1 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n3_text);

        await createCardUsingButton(obsidian, 'child');
        const n4_text = 'n4 child of n3 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n4_text);

        await selectCard(obsidian, 0, 0);
        await deleteCardUsingButton(obsidian);

        const cs = await getTextsOfColumns(obsidian);
        expect(cs).toEqual([[n2_text]]);
    });

    test('edit and save card using card buttons', async () => {
        const n1_text = 'n1 ' + Date.now();
        await typeTextAndSaveItUsingHotkey(obsidian, n1_text);

        await toggleCardEditUsingButton(obsidian);

        const n1_text2 = 'n1 ' + Date.now();
        await typeText(obsidian, n1_text2);
        await saveCardUsingButton(obsidian);
        const cs = await getTextsOfColumns(obsidian);
        expect(cs).toEqual([[n1_text + n1_text2]]);
    });
});
