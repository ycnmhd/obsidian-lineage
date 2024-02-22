import LabeledAnnotations from '../../main';
import { lang } from 'src/lang/lang';
import { MarkdownView, TFile, ViewState } from 'obsidian';
import { fileTypeCache } from 'src/patches/set-view-state';
import { TREE_VIEW_TYPE } from 'src/view/view';

export const registerFileMenuEvent = (plugin: LabeledAnnotations) => {
    plugin.registerEvent(
        plugin.app.workspace.on('file-menu', (menu, file, source, leaf) => {
            if (file instanceof TFile) {
                menu.addItem((item) => {
                    const isTree = fileTypeCache[file.path];
                    item.setTitle(
                        isTree ? lang.open_as_markdown : lang.open_as_tree,
                    );
                    item.setIcon(isTree ? 'file' : 'list-tree');
                    item.onClick(() => {
                        plugin.settings.dispatch({
                            type: isTree
                                ? 'SET_DOCUMENT_TYPE_TO_MARKDOWN'
                                : 'SET_DOCUMENT_TYPE_TO_TREE',
                            payload: {
                                path: file.path,
                            },
                        });

                        if (!leaf) {
                            const leaves = plugin.app.workspace.getLeavesOfType(
                                isTree ? TREE_VIEW_TYPE : 'markdown',
                            );
                            leaf = leaves.find(
                                (l) =>
                                    (l.view as MarkdownView)?.file?.path ===
                                    file.path,
                            );
                        }
                        setTimeout(() => {
                            if (leaf) {
                                leaf.setViewState({
                                    type: isTree ? 'markdown' : TREE_VIEW_TYPE,
                                    popstate: true,
                                    state: leaf.view.getState(),
                                } as ViewState);
                            }
                        }, 0);
                    });
                });
            }
        }),
    );
};
