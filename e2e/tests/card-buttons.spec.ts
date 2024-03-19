import { expect, test } from '@playwright/test';
import { createNewLineageFile } from '../helpers/interactions/lineage-commands/create-new-lineage-file';
import { typeText } from '../helpers/interactions/lineage-view/card/type-text';
import { typeTextAndSaveItUsingHotkey } from '../helpers/interactions/lineage-view/card/type-text-and-save-it-using-hotkey';
import { createCardUsingButton } from '../helpers/interactions/lineage-view/card/create-card-using-button';
import { deleteCardUsingButton } from '../helpers/interactions/lineage-view/card/delete-card-using-button';
import { selectCard } from '../helpers/interactions/lineage-view/card/select-card';
import { toggleCardEditUsingButton } from '../helpers/interactions/lineage-view/card/toggle-card-edit-using-button';
import { saveCardUsingButton } from '../helpers/interactions/lineage-view/card/save-card-using-button';
import { closeThisTabGroup } from '../helpers/interactions/obsidian-commands/close-this-tab-group';
import { getCardText } from '../helpers/getters/lineage-view/card/get-card-text';
import { getCardsOfColumns } from '../helpers/getters/lineage-view/card/get-cards-of-columns';
import { getTextsOfColumns } from '../helpers/getters/lineage-view/card/get-texts-of-columns';
import { resetTextIndex, text } from '../helpers/general/text';
import { loadObsidian } from '../helpers/getters/obsidian/load-obsidian';

test.beforeAll(async () => {
    await loadObsidian();
});
test.beforeEach(async () => {
    await closeThisTabGroup();
    await createNewLineageFile();
    resetTextIndex();
});

test.describe('card buttons', () => {
    test('create card above using card button', async () => {
        const n1_text = text();
        await typeTextAndSaveItUsingHotkey(n1_text);

        await createCardUsingButton('above');
        const n2_text = text();
        await typeTextAndSaveItUsingHotkey(n2_text);

        await selectCard(0, 1);

        await createCardUsingButton('above');
        const n3_text = text();
        await typeTextAndSaveItUsingHotkey(n3_text);

        const cs = await getTextsOfColumns();
        expect(cs).toEqual([[n2_text, n3_text, n1_text]]);
    });

    test('create card below using card button', async () => {
        const n1_text = text();
        await typeTextAndSaveItUsingHotkey(n1_text);

        await createCardUsingButton('below');
        const n2_text = text();
        await typeTextAndSaveItUsingHotkey(n2_text);

        await selectCard(0, 0);

        await createCardUsingButton('below');
        const n3_text = text();
        await typeTextAndSaveItUsingHotkey(n3_text);

        // verify structure
        const c1 = (await getCardsOfColumns())[0];
        expect(await getCardText(c1[0])).toBe(n1_text);
        expect(await getCardText(c1[1])).toBe(n3_text);
        expect(await getCardText(c1[2])).toBe(n2_text);
        const cs = await getTextsOfColumns();
        expect(cs).toEqual([[n1_text, n3_text, n2_text]]);
    });

    test('create child card using card button', async () => {
        const n1_text = text();
        await typeTextAndSaveItUsingHotkey(n1_text);

        await createCardUsingButton('child');
        const n2_text = text();
        await typeTextAndSaveItUsingHotkey(n2_text);

        await selectCard(0, 0);

        await createCardUsingButton('child');
        const n3_text = text();
        await typeTextAndSaveItUsingHotkey(n3_text);

        const cs = await getTextsOfColumns();
        expect(cs).toEqual([[n1_text], [n2_text, n3_text]]);
    });

    test('delete card using card button', async () => {
        const n1_text = text();
        await typeTextAndSaveItUsingHotkey(n1_text);

        await createCardUsingButton('below');
        const n2_text = text();
        await typeTextAndSaveItUsingHotkey(n2_text);

        await selectCard(0, 0);

        await createCardUsingButton('child');
        const n3_text = text();
        await typeTextAndSaveItUsingHotkey(n3_text);

        await createCardUsingButton('child');
        const n4_text = text();
        await typeTextAndSaveItUsingHotkey(n4_text);

        await selectCard(0, 0);
        await deleteCardUsingButton();

        const cs = await getTextsOfColumns();
        expect(cs).toEqual([[n2_text]]);
    });

    test('edit and save card using card buttons', async () => {
        const n1_text = text();
        await typeTextAndSaveItUsingHotkey(n1_text);

        await toggleCardEditUsingButton();

        const n1_text2 = text();
        await typeText(n1_text2);
        await saveCardUsingButton();
        const cs = await getTextsOfColumns();
        expect(cs).toEqual([[n1_text + n1_text2]]);
    });
});
