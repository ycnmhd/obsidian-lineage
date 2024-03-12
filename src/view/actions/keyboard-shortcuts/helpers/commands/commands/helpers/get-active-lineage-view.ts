import Lineage from 'src/main';
import { LineageView } from 'src/view/view';
import invariant from 'tiny-invariant';

export const getActiveLineageView = (plugin: Lineage) => {
    const view = plugin.app.workspace.getActiveViewOfType(LineageView);
    invariant(view, 'could not find lineage view');
    return view;
};
