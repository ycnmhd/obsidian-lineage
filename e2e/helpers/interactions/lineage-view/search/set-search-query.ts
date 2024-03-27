import invariant from 'tiny-invariant';
import { getActiveView } from '../../../getters/lineage-view/card/get-active-view';
import { delay, SHORT } from '../../../general/delay';
import { __obsidian__ } from '../../../getters/obsidian/load-obsidian';

export const SEL_SEARCH_INPUT = `input[aria-label="Search document"]`;

export const setSearchQuery = async (query: string) => {
    const input = await getSearchInput();
    await input.focus();
    await __obsidian__.keyboard.type(query);
    await delay(SHORT);
};

export const getSearchInput = async () => {
    const view = await getActiveView();
    const input = await view.$(SEL_SEARCH_INPUT);
    invariant(input);
    return input;
};
