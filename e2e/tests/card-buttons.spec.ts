import { expect, test } from '@playwright/test';
import { closeObsidian, getObsidian } from '../helpers/getters/obsidian';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands';
import { createNewLineageFile } from '../helpers/interactions/lineage-commands';
import {
    createCardUsingButton,
    deleteCardUsingButton,
    saveCardUsingButton,
    selectCard,
    toggleCardEditUsingButton,
    typeText,
    typeTextAndSaveIt,
} from '../helpers/interactions/lineage-card-ui';
import {
    getCardsOfColumns,
    getCardText,
    getTextsOfColumns,
} from '../helpers/getters/lineage-view';

test.describe('card buttons', () => {
    test('create card above using card button', async () => {
        const obsidian = await getObsidian();

        await closeThisTabGroup(obsidian);

        await createNewLineageFile(obsidian);

        const n1_text = 'file 1 text 1 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n1_text);

        await createCardUsingButton(obsidian, 'above');
        const n2_text = 'file 1 text 2 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n2_text);

        await selectCard(obsidian, 0, 1);

        await createCardUsingButton(obsidian, 'above');
        const n3_text = 'file 1 text 3 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n3_text);

        const cs = await getTextsOfColumns(obsidian);
        expect(cs).toEqual([[n2_text, n3_text, n1_text]]);
        await closeObsidian();
    });

    test('create card below using card button', async () => {
        const obsidian = await getObsidian();

        await closeThisTabGroup(obsidian);

        await createNewLineageFile(obsidian);

        const n1_text = 'file 1 text 1 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n1_text);

        await createCardUsingButton(obsidian, 'below');
        const n2_text = 'file 1 text 2 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n2_text);

        await selectCard(obsidian, 0, 0);

        await createCardUsingButton(obsidian, 'below');
        const n3_text = 'file 1 text 3 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n3_text);

        // verify structure
        const c1 = (await getCardsOfColumns(obsidian))[0];
        expect(await getCardText(c1[0])).toBe(n1_text);
        expect(await getCardText(c1[1])).toBe(n3_text);
        expect(await getCardText(c1[2])).toBe(n2_text);
        const cs = await getTextsOfColumns(obsidian);
        expect(cs).toEqual([[n1_text, n3_text, n2_text]]);
        await closeObsidian();
    });

    test('create child card using card button', async () => {
        const obsidian = await getObsidian();

        await closeThisTabGroup(obsidian);

        await createNewLineageFile(obsidian);

        const n1_text = 'file 1 text 1 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n1_text);

        await createCardUsingButton(obsidian, 'child');
        const n2_text = 'file 1 text 2 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n2_text);

        await selectCard(obsidian, 0, 0);

        await createCardUsingButton(obsidian, 'child');
        const n3_text = 'file 1 text 3 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n3_text);

        const cs = await getTextsOfColumns(obsidian);
        expect(cs).toEqual([[n1_text], [n2_text, n3_text]]);
        await closeObsidian();
    });

    test('delete card using card button', async () => {
        const obsidian = await getObsidian();

        await closeThisTabGroup(obsidian);

        await createNewLineageFile(obsidian);

        const n1_text = 'n1 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n1_text);

        await createCardUsingButton(obsidian, 'below');
        const n2_text = 'n2 below n1 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n2_text);

        await selectCard(obsidian, 0, 0);

        await createCardUsingButton(obsidian, 'child');
        const n3_text = 'n3 child of n1 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n3_text);

        await createCardUsingButton(obsidian, 'child');
        const n4_text = 'n4 child of n3 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n4_text);

        await selectCard(obsidian, 0, 0);
        await deleteCardUsingButton(obsidian);

        const cs = await getTextsOfColumns(obsidian);
        expect(cs).toEqual([[n2_text]]);

        await closeObsidian();
    });

    test('edit and save card using card buttons', async () => {
        const obsidian = await getObsidian();
        await closeThisTabGroup(obsidian);
        await createNewLineageFile(obsidian);

        const n1_text = 'n1 ' + Date.now();
        await typeTextAndSaveIt(obsidian, n1_text);

        await toggleCardEditUsingButton(obsidian);

        const n1_text2 = 'n1 ' + Date.now();
        await typeText(obsidian, n1_text2);
        await saveCardUsingButton(obsidian);
        const cs = await getTextsOfColumns(obsidian);
        expect(cs).toEqual([[n1_text + n1_text2]]);

        await closeObsidian();
    });
});
