import { expect, test as base } from '@playwright/test';
import {
    __test_notice__,
    loadObsidian,
} from './getters/obsidian/load-obsidian';
import { closeThisTabGroup } from './interactions/obsidian-commands/close-this-tab-group';
import { createNewLineageFile } from './interactions/lineage-commands/create-new-lineage-file';
import { resetTextIndex } from './general/text';

const test = base;
test.beforeAll(async () => {
    await loadObsidian();
});
// eslint-disable-next-line no-empty-pattern
test.beforeEach(async ({}, into) => {
    await closeThisTabGroup();
    __test_notice__(into.title);
    await createNewLineageFile();
    resetTextIndex();
});

export { test, expect };
