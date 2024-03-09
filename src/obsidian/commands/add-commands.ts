import { Command, MarkdownView, TFolder } from 'obsidian';
import Lineage from 'src/main';
import { lang } from 'src/lang/lang';
import { slugify } from 'src/helpers/slugify';
import { toggleFileViewType } from 'src/obsidian/events/workspace/helpers/toggle-file-view-type';
import { LineageView } from 'src/view/view';
import { createNewFile } from 'src/obsidian/commands/helpers/create-new-file';

const createCommands = (plugin: Lineage) => {
    const commands: Omit<Command, 'id'>[] = [];

    commands.push({
        name: lang.toggle_lineage_view,
        icon: 'list-tree',
        checkCallback: (checking) => {
            const file =
                plugin.app.workspace.getActiveViewOfType(MarkdownView)?.file ||
                plugin.app.workspace.getActiveViewOfType(LineageView)?.file;
            if (file) {
                if (checking) return true;
                else toggleFileViewType(plugin, file, undefined);
            }
        },
    });

    commands.push({
        name: lang.create_new_file,
        icon: 'list-tree',
        callback: async () => {
            const file =
                plugin.app.workspace.getActiveViewOfType(MarkdownView)?.file ||
                plugin.app.workspace.getActiveViewOfType(LineageView)?.file;
            let folder: TFolder | null = null;
            if (file) {
                folder = file.parent;
            } else {
                folder = plugin.app.vault.getRoot();
            }
            if (folder) await createNewFile(plugin, folder);
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
