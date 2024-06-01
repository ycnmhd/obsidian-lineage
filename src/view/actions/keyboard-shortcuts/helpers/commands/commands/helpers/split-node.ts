import { saveNodeContent } from 'src/view/actions/keyboard-shortcuts/helpers/commands/commands/helpers/save-node-content';
import { LineageView } from 'src/view/view';
import { SplitNodeMode } from 'src/stores/document/reducers/split-node/split-node';

export const splitNode = (view: LineageView, mode: SplitNodeMode) => {
    saveNodeContent(view);
    view.documentStore.dispatch({
        type: 'DOCUMENT/SPLIT_NODE',
        payload: {
            target: view.viewStore.getValue().document.activeNode,
            mode,
        },
    });
};
