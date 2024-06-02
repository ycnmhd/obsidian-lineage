import { Command, MarkdownView, TFolder } from 'obsidian';
import Lineage from 'src/main';
import { lang } from 'src/lang/lang';
import { slugify } from 'src/helpers/slugify';
import { toggleFileViewType } from 'src/obsidian/events/workspace/helpers/toggle-file-view-type';
import { LineageView } from 'src/view/view';
import { createNewFile } from 'src/obsidian/commands/helpers/create-new-file';
import { exportDocument } from 'src/obsidian/commands/helpers/export-document/export-document';
import { openFile } from 'src/obsidian/commands/helpers/open-file';
import { extractBranch } from 'src/obsidian/commands/helpers/extract-branch/extract-branch';
import { isActiveAndNotEditing } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/is-editing';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import { customIcons } from 'src/helpers/load-custom-icons';

const createCommands = (plugin: Lineage) => {
    const commands: Omit<Command, 'id'>[] = [];

    const getActiveFile = () => {
        return (
            plugin.app.workspace.getActiveViewOfType(MarkdownView)?.file ||
            plugin.app.workspace.getActiveViewOfType(LineageView)?.file
        );
    };
    commands.push({
        name: lang.toggle_lineage_view,
        icon: customIcons.cards.name,
        checkCallback: (checking) => {
            const file = getActiveFile();
            if (file) {
                if (checking) return true;
                else {
                    toggleFileViewType(plugin, file, undefined);
                }
            }
        },
    });

    commands.push({
        name: lang.create_new_file,
        icon: customIcons.cards.name,
        callback: async () => {
            try {
                const file = getActiveFile();
                let folder: TFolder | null = null;
                if (file) {
                    folder = file.parent;
                } else {
                    folder = plugin.app.vault.getRoot();
                }
                if (folder) {
                    const newFile = await createNewFile(plugin, folder);
                    if (newFile) {
                        await openFile(plugin, newFile, 'tab', 'lineage');
                    }
                }
            } catch (e) {
                onPluginError(e, 'command', lang.create_new_file);
            }
        },
    });

    commands.push({
        name: lang.toggle_lineage_view,
        icon: customIcons.cards.name,
        checkCallback: (checking) => {
            const file = getActiveFile();
            if (file) {
                if (checking) return true;
                else toggleFileViewType(plugin, file, undefined);
            }
        },
    });
    commands.push({
        name: lang.export_document,
        icon: customIcons.cards.name,
        checkCallback: (checking) => {
            const file = getActiveFile();
            if (file) {
                if (checking) return true;
                else {
                    exportDocument(plugin, file, 'markdown');
                }
            }
        },
    });
    commands.push({
        name: lang.export_document_outline,
        icon: customIcons.cards.name,
        checkCallback: (checking) => {
            const file = getActiveFile();
            if (file) {
                if (checking) return true;
                else {
                    exportDocument(plugin, file, 'outline');
                }
            }
        },
    });

    commands.push({
        name: lang.format_headings,
        icon: 'heading1',
        checkCallback: (checking) => {
            const view = plugin.app.workspace.getActiveViewOfType(LineageView);
            if (view) {
                if (checking) return true;
                else
                    view.documentStore.dispatch({
                        type: 'DOCUMENT/FORMAT_HEADINGS',
                    });
            }
        },
    });
    commands.push({
        name: lang.extract_branch,
        icon: 'file-symlink',
        checkCallback: (checking) => {
            const view = plugin.app.workspace.getActiveViewOfType(LineageView);
            if (view) {
                if (checking) return isActiveAndNotEditing(view);
                else {
                    extractBranch(view);
                }
            }
        },
    });
    return commands;
};

export const addCommands = (plugin: Lineage) => {
    const commands = createCommands(plugin);
    for (const command of commands) {
        plugin.addCommand({
            ...command,
            id: slugify(command.name),
        });
    }
};
