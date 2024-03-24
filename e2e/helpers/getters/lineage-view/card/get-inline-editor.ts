import { getActiveView } from './get-active-view';
import invariant from 'tiny-invariant';

export const LINEAGE_INLINE_EDITOR = '.lineage-card .cm-editor';
export const getInlineEditor = async () => {
    const view = await getActiveView();
    const textArea = await view.$(LINEAGE_INLINE_EDITOR);
    invariant(textArea);
    return textArea;
};
