import { NodeGroup, ViewState } from 'src/stores/view/view-state-type';
import { alignElement } from 'src/stores/view/effects/view/align-branch-effect/helpers/align-branch/helpers/align-element';
import { lastActiveNodeOfGroups } from 'src/stores/view/effects/view/align-branch-effect/align-branch-effect';
import { getNodeElement } from 'src/stores/view/effects/view/align-branch-effect/helpers/align-branch/helpers/get-node-element';

export const alignChildGroup = (
    state: ViewState,
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
            for (const childGroup of state.ui.state.activeBranch.childGroups) {
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
