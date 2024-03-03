import { DNDState } from 'src/stores/view/view-state-type';

export type SetDragCanceled = {
    type: 'DOCUMENT/SET_DRAG_STARTED';
};
export const onDragEnd = (state: DNDState) => {
    state.node = '';
    state.childGroups = new Set();
};
