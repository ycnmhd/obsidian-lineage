import { LineageView } from 'src/view/view';
import { Menu } from 'obsidian';
import { extractBranch } from 'src/obsidian/commands/helpers/extract-branch/extract-branch';
import { mergeNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/merge-node';
import { copyNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/copy-node';
import { cutNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/cut-node';
import { pasteNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/paste-node';
import { splitNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/split-node';
import { customIcons } from 'src/helpers/load-custom-icons';

export const showCardContextMenu = (event: MouseEvent, view: LineageView) => {
    const menu = new Menu();
    menu.addItem((item) =>
        item
            .setTitle('Extract')
            .setIcon('file-symlink')
            .onClick(() => {
                extractBranch(view);
            }),
    );
    menu.addSeparator();

    menu.addItem((item) =>
        item
            .setTitle('Split by headings')
            .setIcon(customIcons.split.name)
            .onClick(() => {
                splitNode(view, 'heading');
            }),
    );

    menu.addSeparator();

    menu.addItem((item) =>
        item
            .setTitle('Merge with the card above')
            .setIcon('merge')
            .onClick(() => {
                mergeNode(view, 'up');
            }),
    );
    menu.addItem((item) =>
        item
            .setTitle('Merge with the card below')
            .setIcon('merge')
            .onClick(() => {
                mergeNode(view, 'down');
            }),
    );
    menu.addSeparator();
    menu.addItem((item) =>
        item
            .setTitle('Copy')
            .setIcon('documents')
            .onClick(() => {
                copyNode(view);
            }),
    );

    menu.addItem((item) =>
        item
            .setTitle('Cut')
            .setIcon('scissors')
            .onClick(() => {
                cutNode(view);
            }),
    );

    menu.addItem((item) =>
        item
            .setTitle('Paste')
            .setIcon('paste')
            .onClick(() => {
                pasteNode(view);
            }),
    );

    menu.showAtMouseEvent(event);
};
