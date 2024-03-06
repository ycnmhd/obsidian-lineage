import {
    DocumentHistory,
    NavigationHistory,
} from 'src/stores/view/view-state-type';

export const removeObsoleteHistoryItems = (
    history: NavigationHistory | DocumentHistory,
) => {
    if (
        history.items.length > 0 &&
        history.state.activeIndex !== history.items.length - 1
    ) {
        // remove obsolete snapshots (between the active snapshot and the end)
        history.items.splice(history.state.activeIndex + 1);
    }
};
