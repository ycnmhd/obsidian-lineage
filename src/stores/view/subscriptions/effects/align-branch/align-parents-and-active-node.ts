import { DocumentState } from 'src/stores/document/document-state-type';
import {
    AlignBranchState,
    alignElement,
} from 'src/stores/view/subscriptions/effects/align-branch/helpers/align-element';
import { getNodeElement } from 'src/stores/view/subscriptions/effects/align-branch/helpers/get-node-element';
import { ViewState } from 'src/stores/view/view-state-type';
import { lastActiveNodeOfGroups } from 'src/stores/view/subscriptions/effects/align-branch/align-branch';

export const alignParentsAndActiveNode = (
    documentState: DocumentState,
    viewState: ViewState,
    container: HTMLElement,
    localState: AlignBranchState,
    behavior?: ScrollBehavior,
) => {
    const group = viewState.document.activeBranch.group;
    lastActiveNodeOfGroups[viewState.document.activeBranch.column] = {
        nodeId: viewState.document.activeNode,
        groupId: group,
    };
    const element = getNodeElement(container, viewState.document.activeNode);
    if (element) {
        const columnId = alignElement(container, element, behavior, 'both');
        if (columnId) localState.columns.add(columnId);
    }
    for (const id of viewState.document.activeBranch.sortedParentNodes) {
        const element = getNodeElement(container, id);
        if (element) {
            const columnId = alignElement(container, element, behavior);
            if (columnId) localState.columns.add(columnId);
        }
    }
};
