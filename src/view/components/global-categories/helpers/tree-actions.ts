import Lineage from 'src/main';
import { lang } from 'src/lang/lang';
import { renderContextMenu } from 'src/obsidian/context-menu/render-context-menu';
import { NameModal } from 'src/view/modals/name-modal/name-modal';
import { GlobalCategoryNode } from 'src/stores/settings/types/global-categories-types';

export const promptCreateNode = async (
    plugin: Lineage,
    parentId: string | null,
    type: 'folder' | 'category',
) => {
    const modal = new NameModal({
        plugin,
        title: type === 'folder' ? lang.cm_new_folder : lang.cm_new_category,
        placeholder:
            type === 'folder'
                ? lang.modal_new_folder_placeholder
                : lang.modal_new_category_placeholder,
    });
    const name = await modal.open();
    if (!name) return;
    plugin.settings.dispatch({
        type:
            type === 'folder'
                ? 'settings/categories/global/create-folder'
                : 'settings/categories/global/create-category',
        payload: { parentId, name },
    });
};

export const promptRenameNode = async (
    plugin: Lineage,
    node: GlobalCategoryNode,
) => {
    const modal = new NameModal({
        plugin,
        title: lang.cm_rename,
        placeholder: lang.modal_rename_placeholder,
        initialValue: node.name,
        submitLabel: lang.modal_button_create,
    });
    const name = await modal.open();
    if (!name) return;
    plugin.settings.dispatch({
        type: 'settings/categories/global/rename',
        payload: { id: node.id, name },
    });
};

type TreeContextMenuOptions = {
    onDelete: (node: GlobalCategoryNode) => void;
};

export const showTreeContextMenu = (
    plugin: Lineage,
    event: MouseEvent,
    node: GlobalCategoryNode,
    options: TreeContextMenuOptions,
) => {
    const items: Parameters<typeof renderContextMenu>[1] = [];

    if (node.type === 'folder') {
        items.push({
            title: lang.cm_new_folder,
            icon: 'folder-plus',
            action: () => promptCreateNode(plugin, node.id, 'folder'),
        });
        items.push({
            title: lang.cm_new_category,
            icon: 'tag',
            action: () => promptCreateNode(plugin, node.id, 'category'),
        });
        items.push({ type: 'separator' });
    }

    items.push({
        title: lang.cm_rename,
        icon: 'pencil',
        action: () => promptRenameNode(plugin, node),
    });
    items.push({
        title: lang.cm_delete,
        icon: 'trash-2',
        dangerous: true,
        action: () => options.onDelete(node),
    });

    renderContextMenu(event, items);
};

/** Context menu for the empty tree / root area (create at root level). */
export const showRootContextMenu = (
    plugin: Lineage,
    event: MouseEvent,
) => {
    const items: Parameters<typeof renderContextMenu>[1] = [
        {
            title: lang.cm_new_folder,
            icon: 'folder-plus',
            action: () => promptCreateNode(plugin, null, 'folder'),
        },
        {
            title: lang.cm_new_category,
            icon: 'tag',
            action: () => promptCreateNode(plugin, null, 'category'),
        },
    ];
    renderContextMenu(event, items);
};
