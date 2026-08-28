import { LineageView } from 'src/view/view';
import { MenuItemObject } from 'src/obsidian/context-menu/render-context-menu';
import { lang } from 'src/lang/lang';
import { customIcons } from 'src/helpers/load-custom-icons';
import { Notice } from 'obsidian';
import { openSplitNodeModal } from 'src/view/modals/split-node-modal/open-split-node-modal';
import { sortChildNodes } from 'src/view/actions/context-menu/card-context-menu/helpers/sort-child-nodes';
import { mergeNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/merge-node';
import { copyLinkToBlock } from 'src/view/actions/context-menu/card-context-menu/helpers/copy-link-to-block';
import { copyActiveNodesToClipboard } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/clipboard/copy-active-nodes-to-clipboard';
import { copyActiveBranchesToClipboard } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/clipboard/copy-active-branches-to-clipboard';
import { cutNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/cut-node';
import { pasteNode } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/paste-node';
import { extractBranch } from 'src/obsidian/commands/helpers/extract-branch/extract-branch';
import { exportSelection } from 'src/view/actions/context-menu/card-context-menu/helpers/export-selection';
import { revealInLeftSidebar } from 'src/view/actions/context-menu/card-context-menu/helpers/reveal-in-left-sidebar';
import {
    createCategorySubmenu,
    togglePinNode,
} from 'src/view/actions/context-menu/card-context-menu/create-sidebar-context-menu-items';

type Props = {
    activeNode: string;
    hasChildren: boolean;
    isPinned: boolean;
};
export const createSingleNodeContextMenuItems = (
    view: LineageView,
    { hasChildren, isPinned, activeNode }: Props,
) => {
    const menuItems: MenuItemObject[] = [
        {
            title: lang.cm_split_node,
            icon: customIcons.split.name,
            action: () => {
                if (hasChildren) {
                    new Notice(lang.error_cm_cant_split_node_that_has_children);
                } else {
                    openSplitNodeModal(view);
                }
            },
        },
        {
            title: lang.cm_sort_child,
            icon: 'sort-asc',
            disabled: !hasChildren,
            submenu: [
                {
                    title: lang.cm_sort_child_nodes_asc,
                    icon: 'sort-asc',
                    action: () => sortChildNodes(view, activeNode, 'ascending'),
                },
                {
                    title: lang.cm_sort_child_nodes_desc,
                    icon: 'sort-desc',
                    action: () =>
                        sortChildNodes(view, activeNode, 'descending'),
                },
            ],
        },
        { type: 'separator' },
        {
            title: lang.cm_merge_above,
            icon: 'merge',
            action: () => mergeNode(view, 'up'),
        },
        {
            title: lang.cm_merge_below,
            icon: 'merge',
            action: () => mergeNode(view, 'down'),
        },

        { type: 'separator' },
        {
            title: lang.cm_copy_link_to_block,
            icon: 'links-coming-in',
            action: () => copyLinkToBlock(view, false),
        },
        { type: 'separator' },
        !hasChildren
            ? {
                  title: lang.cm_copy,
                  icon: 'documents',
                  action: () => copyActiveNodesToClipboard(view, false),
              }
            : {
                  title: lang.cm_copy,
                  icon: 'documents',
                  submenu: [
                      {
                          title: lang.cm_copy_branch,
                          icon: 'lineage-cards',
                          action: () =>
                              copyActiveBranchesToClipboard(view, true, false),
                      },
                      {
                          title: lang.cm_copy_branch_wo_formatting,
                          icon: 'file-text',
                          action: () =>
                              copyActiveBranchesToClipboard(view, false, false),
                      },
                      {
                          title: lang.cm_copy_nodes_wo_subitems,
                          icon: 'file-text',
                          action: () => copyActiveNodesToClipboard(view, false),
                      },
                  ],
              },
        {
            title: lang.cm_cut,
            icon: 'scissors',
            action: () => cutNode(view),
        },
        {
            title: lang.cm_paste,
            icon: 'paste',
            action: () => pasteNode(view),
        },
        { type: 'separator' },
        ...(isPinned
            ? [
                  {
                      title: lang.cm_category,
                      icon: 'tag',
                      submenu: createCategorySubmenu(view, activeNode),
                  },
                  {
                      title: lang.cm_reveal_in_left_sidebar,
                      icon: 'pin',
                      action: () => revealInLeftSidebar(view, activeNode),
                  },
              ]
            : []),
        {
            title: isPinned
                ? lang.cm_unpin_from_left_sidebar
                : lang.cm_pin_in_left_sidebar,
            icon: isPinned ? 'pin-off' : 'pin',
            action: () => {
                togglePinNode(view, activeNode, false, false);
            },
        },
        { type: 'separator' },
        {
            title: hasChildren
                ? lang.cm_extract_branch
                : lang.cm_extract_section,
            icon: customIcons.cards.name,
            action: () => extractBranch(view),
        },
        !hasChildren
            ? {
                  title: lang.cm_export_section,
                  icon: 'file-text',
                  action: () => exportSelection(view, false),
              }
            : {
                  title: lang.cm_export_selection,
                  icon: 'file-text',
                  submenu: [
                      {
                          title: lang.cm_export_branch_with_subitems,
                          icon: 'file-text',
                          action: () => exportSelection(view, true),
                      },
                      {
                          title: lang.cm_export_branch_wo_subitems,
                          icon: 'file-text',
                          action: () => exportSelection(view, false),
                      },
                  ],
              },
    ];
    return menuItems;
};
