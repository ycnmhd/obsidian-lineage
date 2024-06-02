import { LineageView } from 'src/view/view';
import { Menu } from 'obsidian';
import { extractBranch } from 'src/obsidian/commands/helpers/extract-branch/extract-branch';
import { mergeNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/merge-node';
import { copyNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/copy-node';
import { cutNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/cut-node';
import { pasteNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/paste-node';
import { splitNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/split-node';
import { customIcons } from 'src/helpers/load-custom-icons';
import { hasHeading } from 'src/view/actions/context-menu/helpers/flags/has-heading';
import { hasBulletList } from 'src/view/actions/context-menu/helpers/flags/has-bullet-list';

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

    const input =
        view.documentStore.getValue().document.content[
            view.viewStore.getValue().document.activeNode
        ]?.content || '';

    menu.addSeparator();

    const _hasHeading = hasHeading(input);
    const _hasBulletList = !_hasHeading && hasBulletList(input);
    menu.addItem((item) =>
        item
            .setTitle('Split by headings')
            .setIcon(customIcons.split.name)
            .onClick(() => {
                splitNode(view, 'heading');
            })
            .setDisabled(!_hasHeading),
    );
    menu.addItem((item) =>
        item
            .setTitle('Split outline')
            .setIcon(customIcons.split.name)
            .onClick(() => {
                splitNode(view, 'outline');
            })
            .setDisabled(!_hasBulletList),
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
