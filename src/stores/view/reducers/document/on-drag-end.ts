import { DNDState } from 'src/stores/view/default-view-state';

export type SetDragCanceled = {
    type: 'DOCUMENT/SET_DRAG_ENDED';
};
export const onDragEnd = (state: DNDState) => {
    state.node = '';
    state.childGroups = new Set();
};
