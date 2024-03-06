import { MarkdownRenderer } from 'obsidian';
import {
    getPlugin,
    getStore,
    getView,
} from 'src/view/components/container/context';

export const markdownPreviewAction = (
    element: HTMLElement,
    content: string,
) => {
    const view = getView();
    const plugin = getPlugin();
    const store = getStore();

    const render = (content: string) => {
        if (view && element) {
            element.empty();
            MarkdownRenderer.render(
                plugin.app,
                content,
                element,
                store.getValue().file.path as string,
                view,
            );
        }
    };
    render(content);
    return {
        update: (content: string) => {
            render(content);
        },
    };
};
