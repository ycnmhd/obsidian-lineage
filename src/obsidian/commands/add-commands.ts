import { Command } from 'obsidian';
import Lineage from 'src/main';
import { lang } from 'src/lang/lang';
import { slugify } from 'src/helpers/slugify';
import { toggleFileViewType } from 'src/obsidian/events/workspace/effects/toggle-file-view-type';
import { customIcons } from 'src/helpers/load-custom-icons';
import { getActiveFile } from 'src/obsidian/commands/helpers/get-active-file';
import { createLineageDocument } from 'src/obsidian/events/workspace/effects/create-lineage-document';
import { getActiveLineageView } from 'src/obsidian/commands/helpers/get-active-lineage-view';
import { openGlobalCategoriesView } from 'src/obsidian/events/workspace/effects/open-global-categories-view';
import { openSplitNodeModal } from 'src/view/modals/split-node-modal/open-split-node-modal';
import { isEditing } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';
import { copyLinkToBlock } from 'src/view/actions/context-menu/card-context-menu/helpers/copy-link-to-block';
import { extractBranch } from 'src/obsidian/commands/helpers/extract-branch/extract-branch';
import { exportSelection } from 'src/view/actions/context-menu/card-context-menu/helpers/export-selection';
import { exportDocument } from 'src/obsidian/commands/helpers/export-document/export-document';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import { sortChildNodes } from 'src/view/actions/context-menu/card-context-menu/helpers/sort-child-nodes';
import { ejectDocument } from 'src/obsidian/commands/helpers/export-document/eject-document';
import { isSidebarActive } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/sidebar-navigation';
import { getActiveGlobalCardContext } from 'src/view/components/global-categories/helpers/global-view-keyboard';
import type { LineageView } from 'src/view/view';
import { resolveAddTarget } from 'src/obsidian/commands/helpers/add-card-to-global-category';
import { openAddToGlobalCategoryModal } from 'src/view/modals/add-to-global-category/add-to-global-category-modal';

const createCommands = (plugin: Lineage) => {
    const commands: (Omit<Command, 'id' | 'callback'> & {
        checkCallback: (checking: boolean) => boolean | void;
    })[] = [];
    commands.push({
        name: lang.cmd_toggle_lineage_view,
        icon: customIcons.cards.name,
        checkCallback: (checking) => {
            const file = getActiveFile(plugin);
            if (file) {
                if (checking) return true;
                else {
                    toggleFileViewType(plugin, file, undefined);
                }
            }
        },
    });

    commands.push({
        name: lang.cmd_create_new_document,
        icon: customIcons.cards.name,
        checkCallback: (checking) => {
            if (checking) return true;
            createLineageDocument(plugin);
        },
    });

    commands.push({
        name: lang.cmd_open_global_categories,
        icon: customIcons.folderTree.name,
        checkCallback: (checking) => {
            if (checking) return true;
            openGlobalCategoriesView(plugin);
        },
    });

    commands.push({
        name: lang.cmd_toggle_horizontal_scrolling_mode,
        icon: customIcons.alignH.name,
        checkCallback: (checking) => {
            if (checking) {
                return Boolean(getActiveLineageView(plugin));
            }
            plugin.settings.dispatch({
                type: 'settings/view/toggle-horizontal-scrolling-mode',
            });
        },
    });

    commands.push({
        name: lang.cmd_toggle_vertical_scrolling_mode,
        icon: customIcons.alignV.name,
        checkCallback: (checking) => {
            if (checking) {
                return Boolean(getActiveLineageView(plugin));
            }
            plugin.settings.dispatch({
                type: 'settings/view/toggle-vertical-scrolling-mode',
            });
        },
    });

    commands.push({
        name: lang.cm_split_node,
        icon: customIcons.split.name,
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            if (!view) return;
            openSplitNodeModal(view);
        },
    });

    commands.push({
        name: lang.cmd_sort_child_nodes_asc,
        icon: 'sort-asc',
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            if (!view) return;
            sortChildNodes(
                view,
                view.viewStore.getValue().document.activeNode,
                'ascending',
            );
        },
    });

    commands.push({
        name: lang.cmd_sort_child_nodes_desc,
        icon: 'sort-desc',
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            if (!view) return;
            sortChildNodes(
                view,
                view.viewStore.getValue().document.activeNode,
                'descending',
            );
        },
    });

    commands.push({
        name: lang.cm_copy_link_to_block,
        icon: 'links-coming-in',
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            const globalContext = getActiveGlobalCardContext();
            if (checking) {
                return Boolean(view) || Boolean(globalContext);
            }
            // Lineage view focused → copy from the active card/sidebar context
            if (view) {
                // Detect if sidebar is active to copy from the correct context
                const isInSidebar = isSidebarActive(view);
                copyLinkToBlock(view, isInSidebar);
                return true;
            }
            // Global categories view focused → copy the selected card
            if (globalContext) {
                copyLinkToBlock(
                    globalContext.virtualView as unknown as LineageView,
                    true,
                );
                return true;
            }
            return false;
        },
    });

    commands.push({
        name: lang.cmd_toggle_pin_in_left_sidebar,
        icon: 'pin',
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return view ? isEditing(view) : false;
            }
            if (!view) return;
            const viewState = view.viewStore.getValue();

            const documentStore = view.documentStore;
            const documentState = documentStore.getValue();
            const activeNode = viewState.document.activeNode;
            const isPinned = documentState.pinnedNodes.Ids.includes(activeNode);
            documentStore.dispatch({
                type: isPinned
                    ? 'document/pinned-nodes/unpin'
                    : 'document/pinned-nodes/pin',
                payload: { id: activeNode },
            });
        },
    });

    commands.push({
        name: lang.cmd_extract_branch,
        icon: customIcons.cards.name,
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            if (!view) return;
            extractBranch(view);
        },
    });

    commands.push({
        name: lang.cmd_export_branches_with_subitems,
        icon: 'file-text',
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            if (!view) return;
            exportSelection(view, true);
        },
    });

    commands.push({
        name: lang.cmd_export_nodes_wo_subitems,
        icon: 'file-text',
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            if (!view) return;
            exportSelection(view, false);
        },
    });

    commands.push({
        name: lang.cm_export_document,
        icon: 'file-text',
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            if (!view) return;
            exportDocument(view);
        },
    });

    commands.push({
        name: lang.cm_eject_document,
        icon: 'file-text',
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            if (!view) return;
            ejectDocument(view);
        },
    });

    commands.push({
        name: lang.cmd_toggle_minimap,
        icon: 'panel-right',
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            plugin.settings.dispatch({
                type: 'settings/view/toggle-minimap',
            });
        },
    });

    commands.push({
        name: lang.cmd_toggle_left_sidebar,
        icon: 'panel-left',
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            if (!view) return;
            view.viewStore.dispatch({ type: 'view/left-sidebar/toggle' });
        },
    });

    commands.push({
        name: lang.cmd_toggle_zen_mode,
        icon: 'focus',
        checkCallback: (checking) => {
            const isZenOn = plugin.store.getValue().zenMode;
            if (checking) {
                // Always available while zen is on (so it can be turned off
                // from any view); otherwise only on a Lineage view (to turn it
                // on).
                return isZenOn || Boolean(getActiveLineageView(plugin));
            }
            plugin.store.dispatch({ type: 'plugin/zen/toggle' });
        },
    });

    commands.push({
        name: lang.cmd_space_between_cards,
        icon: customIcons.gap.name,
        checkCallback: (checking) => {
            const view = getActiveLineageView(plugin);
            if (checking) {
                return Boolean(view);
            }
            if (!view) return;
            view.plugin.settings.dispatch({
                type: 'view/modes/gap-between-cards/toggle',
            });
        },
    });

    commands.push({
        name: lang.cmd_add_card_to_global_category,
        icon: 'tag',
        checkCallback: (checking) => {
            const target = resolveAddTarget(plugin);
            if (checking) return Boolean(target);
            if (!target) return false;
            openAddToGlobalCategoryModal(plugin, target);
        },
    });

    return commands;
};

export const addCommands = (plugin: Lineage) => {
    const commands = createCommands(plugin);
    for (const command of commands) {
        plugin.addCommand({
            ...command,
            checkCallback: (checking) => {
                try {
                    return command.checkCallback(checking);
                } catch (e) {
                    onPluginError(e, 'command', command.name);
                    return false;
                }
            },
            id: slugify(command.name),
        });
    }
};
