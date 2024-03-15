import { Page } from '@playwright/test';
import invariant from 'tiny-invariant';

export const rightClickFolder = async (obsidian: Page, name: string) => {
    const button = await obsidian.$(`div[data-path="${name}"]`);
    invariant(button);
    await button.click({ button: 'right' });
};
