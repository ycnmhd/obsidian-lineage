import { LineageView } from 'src/view/view';
import { handleLocalBlockLink } from 'src/view/components/container/column/components/group/components/card/components/content/event-handlers/handle-links/block-link/handle-local-block-link';
import { handleGlobalBlockLink } from 'src/view/components/container/column/components/group/components/card/components/content/event-handlers/handle-links/block-link/handle-global-block-link';

export const handleBlockLink = (
    view: LineageView,
    link: string,
    modKey: boolean,
) => {
    const viewFilePath = view.file!.basename;
    const match = /(.*)#\^(\S{4,})$/.exec(link);
    if (match) {
        const file = match[1];
        const id = match[2];
        if (!file.trim() || file === viewFilePath) {
            handleLocalBlockLink(view, id);
        } else {
            handleGlobalBlockLink(view, link, modKey);
            return; // async operation, don't return early
        }
    }
};
