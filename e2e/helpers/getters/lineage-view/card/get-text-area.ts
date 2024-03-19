import { getActiveView } from './get-active-view';
import invariant from 'tiny-invariant';

export const LINEAGE_TEXTAREA = '.lineage__card textarea';
export const getTextArea = async () => {
    const view = await getActiveView();
    const textArea = await view.$(LINEAGE_TEXTAREA);
    invariant(textArea);
    return textArea;
};
