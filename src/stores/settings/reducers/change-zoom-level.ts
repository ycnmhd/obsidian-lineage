import { Settings } from 'src/stores/settings/settings-type';

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
    state: Settings,
    payload: ChangeZoomLevelAction['payload'],
) => {
    if ('value' in payload) {
        state.view.zoomLevel = payload.value;
    } else {
        state.view.zoomLevel =
            payload.direction === 'in'
                ? Math.min(state.view.zoomLevel + zoomStep, maxZoomLevel)
                : Math.max(state.view.zoomLevel - zoomStep, minZoomLevel);
    }
};
