import {
    DocumentState,
    NodeGroup,
} from 'src/stores/document/document-state-type';
import { alignElement } from 'src/stores/view/subscriptions/effects/align-branch/helpers/align-element';
import { getNodeElement } from 'src/stores/view/subscriptions/effects/align-branch/helpers/get-node-element';
import { ViewState } from 'src/stores/view/view-state-type';
import { lastActiveNodeOfGroups } from 'src/stores/view/subscriptions/effects/align-branch/align-branch';

export const alignChildGroup = (
    documentState: DocumentState,
    viewState: ViewState,
    container: HTMLElement,
    childGroups: NodeGroup[],
    columnId: string,
    behavior?: ScrollBehavior,
) => {
    const lastActiveNodeOfGroup = lastActiveNodeOfGroups[columnId];
    const groupWithPreviousActiveNode =
        lastActiveNodeOfGroup &&
        childGroups.find((g) => lastActiveNodeOfGroup.groupId === g.parentId);
    const columnElement = getNodeElement(container, columnId);
    if (!columnElement) return;
    let element: HTMLElement | null = null;
    if (groupWithPreviousActiveNode) {
        element = getNodeElement(columnElement, lastActiveNodeOfGroup.nodeId);
    }
    if (element) alignElement(container, element, behavior);
    else {
        const elements: HTMLElement[] = [];
        if (columnElement) {
            for (const childGroup of viewState.document.activeBranch
                .childGroups) {
                const element = getNodeElement(
                    columnElement,
                    'group-' + childGroup,
                );
                if (element) {
                    elements.push(element);
                }
            }

            alignElement(
                container,
                elements.length > 1 ? elements : elements[0],
                behavior,
            );
        }
    }
};
