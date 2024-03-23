import { getActiveView } from './get-active-view';

import { LINEAGE_INLINE_EDITOR } from './get-inline-editor';

export const maybeGetInlineEditor = async () => {
    const view = await getActiveView();
    return await view.$(LINEAGE_INLINE_EDITOR);
};
