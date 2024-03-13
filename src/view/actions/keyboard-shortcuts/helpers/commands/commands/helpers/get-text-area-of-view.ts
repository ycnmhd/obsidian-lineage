import { LineageView } from 'src/view/view';

export const getTextAreaOfView = (view: LineageView) => {
    return view.contentEl.querySelector('textarea');
};
