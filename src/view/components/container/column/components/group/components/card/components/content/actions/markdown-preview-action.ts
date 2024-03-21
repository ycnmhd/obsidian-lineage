import { MarkdownRenderer } from 'obsidian';
import { getPlugin, getView } from 'src/view/components/container/context';

export const markdownPreviewAction = (
    element: HTMLElement,
    content: string,
) => {
    const plugin = getPlugin();
    const view = getView();
    const store = view.documentStore;

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
