import { ViewState } from 'src/stores/view/view-state-type';
import { ViewStoreAction } from 'src/stores/view/view-store-actions';
import { setSearchQuery } from 'src/stores/view/reducers/search/set-search-query';
import { setSearchResults } from 'src/stores/view/reducers/search/set-search-results';
import { toggleSearchInput } from 'src/stores/view/reducers/search/toggle-search-input';
import { changeZoomLevel } from 'src/stores/view/reducers/ui/change-zoom-level';
import { setTreeIndex } from 'src/stores/view/reducers/ui/set-tree-index';
import { enableEditMode } from 'src/stores/view/reducers/document/enable-edit-mode';
import { disableEditMode } from 'src/stores/view/reducers/document/disable-edit-mode';
import { onDragStart } from 'src/stores/view/reducers/document/on-drag-start';
import { onDragEnd } from 'src/stores/view/reducers/document/on-drag-end';
import { updateActiveBranch } from 'src/stores/view/reducers/document/helpers/update-active-branch';
import { updateActiveNode } from 'src/stores/view/reducers/document/helpers/update-active-node';
import { navigateUsingKeyboard } from 'src/stores/view/reducers/document/navigate-using-keyboard';
import { navigateActiveNode } from 'src/stores/view/reducers/ui/navigate-active-node';
import { jumpToNode } from 'src/stores/view/reducers/document/jump-to-node';

import { removeDeletedNavigationItems } from 'src/stores/view/reducers/ui/helpers/remove-deleted-navigation-items';

const updateDocumentState = (state: ViewState, action: ViewStoreAction) => {
    if (action.type === 'DOCUMENT/SET_ACTIVE_NODE') {
        updateActiveNode(
            state.document,
            action.payload.id,
            state.navigationHistory,
        );
    } else if (action.type === 'DOCUMENT/NAVIGATE_USING_KEYBOARD') {
        navigateUsingKeyboard(state.document, state.navigationHistory, action);
    } else if (action.type === 'SEARCH/SET_QUERY') {
        setSearchQuery(state, action.payload.query);
    } else if (action.type === 'SEARCH/SET_RESULTS') {
        setSearchResults(state, action.payload.results);
    } else if (action.type === 'SEARCH/TOGGLE_INPUT') {
        toggleSearchInput(state);
    } else if (action.type === 'UI/TOGGLE_HISTORY_SIDEBAR') {
        state.ui.showHelpSidebar = false;
        state.ui.showHistorySidebar = !state.ui.showHistorySidebar;
    } else if (action.type === 'UI/TOGGLE_HELP_SIDEBAR') {
        state.ui.showHistorySidebar = false;
        state.ui.showHelpSidebar = !state.ui.showHelpSidebar;
    } else if (action.type === 'UI/CHANGE_ZOOM_LEVEL') {
        changeZoomLevel(state, action.payload);
    } else if (action.type === 'UI/SET_TREE_INDEX') {
        setTreeIndex(state.document, action.payload.treeIndex);
    } else if (action.type === 'DOCUMENT/ENABLE_EDIT_MODE') {
        enableEditMode(state.document.editing, action);
    } else if (action.type === 'DOCUMENT/DISABLE_EDIT_MODE') {
        disableEditMode(state.document.editing);
    } else if (action.type === 'SET_DRAG_STARTED') {
        onDragStart(state.document.dnd, action);
    } else if (action.type === 'DOCUMENT/SET_DRAG_ENDED') {
        onDragEnd(state.document.dnd);
    } else if (action.type === 'UPDATE_ACTIVE_BRANCH') {
        updateActiveBranch(
            state.document.activeBranch,
            state.document.activeNode,
            action.payload.columns,
        );
    } else if (action.type === 'NAVIGATION/NAVIGATE_FORWARD') {
        navigateActiveNode(state.document, state.navigationHistory, true);
    } else if (action.type === 'NAVIGATION/NAVIGATE_BACK') {
        navigateActiveNode(state.document, state.navigationHistory);
    } else if (action.type === 'DOCUMENT/JUMP_TO_NODE') {
        jumpToNode(state.document, state.navigationHistory, action);
    } else if (action.type === 'NAVIGATION/REMOVE_OBSOLETE') {
        removeDeletedNavigationItems(
            state.navigationHistory,
            action.payload.content,
        );
    }
};
export const viewReducer = (
    store: ViewState,
    action: ViewStoreAction,
): ViewState => {
    updateDocumentState(store, action);
    return store;
};
