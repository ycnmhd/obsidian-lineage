import { LineageView } from 'src/view/view';
import invariant from 'tiny-invariant';

export const getTextAreaOfView = (view: LineageView) => {
    const textArea = view.contentEl.querySelector('textarea');
    invariant(textArea, 'could not find textarea element');
    return textArea;
};
