import { LineageView } from 'src/view/view';
import { derived } from 'src/lib/store/derived';
import Lineage from 'src/main';

export const ViewSettingsStore = (view: LineageView) =>
    derived(view.plugin.settings, (state) => state.view);

export const ShowLeftSidebarStore = (view: LineageView) =>
    derived(view.viewStore, (state) => state.ui.controls.showLeftSidebar);

export const LeftSidebarWidthStore = (view: LineageView) =>
    derived(view.plugin.settings, (state) => state.view.leftSidebarWidth);

export const LeftSidebarActiveTabStore = (view: LineageView) =>
    derived(view.plugin.settings, (state) => state.view.leftSidebarActiveTab);

export const ApplyGapBetweenCardsStore = (view: LineageView) =>
    derived(view.plugin.settings, (state) => state.view.applyGapBetweenCards);

export const OutlineModeStore = (view: LineageView) =>
    derived(view.plugin.settings, (state) => state.view.outlineMode);

export const MindmapModeStore = (view: LineageView) =>
    derived(view.plugin.settings, (state) => state.view.mindmapMode);

export const MaintainEditMode = (view: LineageView) =>
    derived(view.plugin.settings, (state) => state.view.maintainEditMode);

export const AlwaysShowCardButtons = (view: LineageView) =>
    derived(view.plugin.settings, (state) => state.view.alwaysShowCardButtons);

export const HiddenVerticalToolbarButtons = (plugin: Lineage) =>
    derived(
        plugin.settings,
        (state) => state.view.hiddenVerticalToolbarButtons,
    );
