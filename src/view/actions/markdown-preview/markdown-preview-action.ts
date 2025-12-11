import { MarkdownRenderer } from 'obsidian';
import { getPlugin, getView } from 'src/view/components/container/context';
import { contentStore } from 'src/stores/document/derived/content-store';
import { formatText } from 'src/view/actions/markdown-preview/helpers/format-text';

export const markdownPreviewAction = (element: HTMLElement, nodeId: string) => {
    const plugin = getPlugin();
    const view = getView();

    // Helper: sanitize tag into a CSS-safe fragment
    const sanitizeTag = (tag: string) =>
        String(tag)
            .toLowerCase()
            .replace(/[^a-z0-9\-_]/g, '-')
            .replace(/-{2,}/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 60);

    // Extract tags from raw markdown content (Obsidian-style tags: #tag or #folder/tag)
    const extractTagsFromRaw = (raw: string) => {
        const re = /(?:^|\s)#([^\s#`[\]<>]+)/g;
        const tags = new Set<string>();
        let m: RegExpExecArray | null = null;
        while ((m = re.exec(raw)) !== null) {
            const s = sanitizeTag(m[1]);
            if (s) tags.add(s);
        }
        return Array.from(tags);
    };

    // Render preview and then apply `has-tag-...` classes to the preview container (element).
    // We await MarkdownRenderer.render so we can reliably apply classes after the preview is ready.
    const render = async (content: string) => {
        if (!(view && element)) return;

        // Keep raw content for tag extraction before any formatting
        const rawContent = content;

        element.empty();
        if (content.length > 0) {
            content = formatText(content);
        }

        // Render markdown into the element. Await to ensure DOM is ready.
        await MarkdownRenderer.render(
            plugin.app,
            content,
            element,
            view.file!.path,
            view,
        );

        try {
            // Remove previously applied tag classes to avoid leakage
            const prev = Array.from(element.classList).filter((c) =>
                c.startsWith('has-tag-'),
            );
            for (const c of prev) element.classList.remove(c);

            // Extract tags from the raw markdown and add classes to the preview container only
            const tags = extractTagsFromRaw(rawContent);
            for (const t of tags) {
                element.classList.add(`has-tag-${t}`);
            }
        } catch (e) {
            // swallow any DOM errors to avoid breaking rendering
            // eslint-disable-next-line no-console
            console.debug('[Lineage] apply tag classes failed', e);
        }
    };

    const $content = contentStore(view, nodeId);
    const unsub = $content.subscribe((content) => {
        render(content);
    });
    return {
        destroy: () => {
            unsub();
        },
    };
};
