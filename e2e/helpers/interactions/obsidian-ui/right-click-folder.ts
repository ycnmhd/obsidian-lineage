import invariant from 'tiny-invariant';
import { __obsidian__ } from '../../getters/obsidian/load-obsidian';

export const rightClickFolder = async (name: string) => {
    const button = await __obsidian__.$(`div[data-path="${name}"]`);
    invariant(button);
    await button.click({ button: 'right' });
};
