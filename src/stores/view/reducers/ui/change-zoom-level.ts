import { ViewState } from 'src/stores/view/view-state-type';

const zoomStep = 0.1;
export const maxZoomLevel = 2;
export const minZoomLevel = 0.1;

export type ChangeZoomLevelAction = {
    type: 'UI/CHANGE_ZOOM_LEVEL';
    payload:
        | {
              direction: 'in' | 'out';
          }
        | {
              value: number;
          };
};

export const changeZoomLevel = (
    state: ViewState,
    payload: ChangeZoomLevelAction['payload'],
) => {
    if ('value' in payload) {
        state.ui.zoomLevel = payload.value;
    } else {
        state.ui.zoomLevel =
            payload.direction === 'in'
                ? Math.min(state.ui.zoomLevel + zoomStep, maxZoomLevel)
                : Math.max(state.ui.zoomLevel - zoomStep, minZoomLevel);
    }
};
