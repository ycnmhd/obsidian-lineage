import { DNDState } from 'src/stores/document/document-type';

export type SetDragCanceled = {
    type: 'SET_DRAG_CANCELED';
};
export const onDragEnd = (state: DNDState) => {
    state.node = '';
    state.childGroups = new Set();
};
