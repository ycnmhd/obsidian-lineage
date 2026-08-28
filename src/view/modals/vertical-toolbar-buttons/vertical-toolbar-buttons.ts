import { lang } from 'src/lang/lang';
import {
    Keyboard,
    Minus as ZoomOut,
    Palette,
    PanelRightInactive as PanelRight,
    Plus as ZoomIn,
    RotateCcw,
    ScanSearch,
} from 'lucide-svelte';
import { CustomIcon, customIcons } from 'src/helpers/load-custom-icons';

export type ToolbarButton =
    | 'settings'
    | 'minimap'
    | 'hotkeys'
    | 'style-rules'
    | 'center-active-node-h'
    | 'center-active-node-v'
    | 'outline-mode'
    | 'mindmap-mode'
    | 'space-between-cards'
    | 'snapshots-list'
    | 'undo'
    | 'redo'
    | 'snapshots-list'
    | 'zoom-in'
    | 'zoom-out'
    | 'zoom-reset'
    | 'zoom-presets';

export type VerticalToolbarGroup = {
    id: string;
    buttons: {
        label: string;
        icon: typeof PanelRight | CustomIcon;
        id: ToolbarButton;
        hidden?: boolean;
    }[];
};

export const verticalToolbarButtons: VerticalToolbarGroup[] = [
    {
        id: 'settings',
        buttons: [
            {
                id: 'hotkeys',
                label: lang.controls_hotkeys,
                icon: Keyboard,
            },
            {
                id: 'style-rules',
                label: lang.controls_rules,
                icon: Palette,
            },
        ],
    },
    {
        id: 'scroll',
        buttons: [
            {
                id: 'center-active-node-h',
                label: lang.controls_toggle_scrolling_mode_horizontal,
                icon: customIcons.alignH,
            },
            {
                id: 'center-active-node-v',
                label: lang.controls_toggle_scrolling_mode_vertical,
                icon: customIcons.alignV,
            },
        ],
    },
    {
        id: 'display',
        buttons: [
            {
                id: 'outline-mode',
                label: lang.controls_single_column,
                icon: customIcons.outline,
            },
            {
                id: 'mindmap-mode',
                label: lang.controls_mindmap_mode,
                icon: customIcons.mindmap,
            },
            {
                id: 'space-between-cards',
                label: lang.controls_gap_between_cards,
                icon: customIcons.gap,
            },
        ],
    },

    {
        id: 'zoom',
        buttons: [
            {
                id: 'zoom-in',
                label: lang.controls_zoom_in,
                icon: ZoomIn,
            },
            {
                id: 'zoom-reset',
                label: lang.controls_zoom_reset,
                icon: RotateCcw,
            },
            {
                id: 'zoom-presets',
                label: lang.controls_zoom_presets,
                icon: ScanSearch,
            },
            {
                id: 'zoom-out',
                label: lang.controls_zoom_out,
                icon: ZoomOut,
            },
        ],
    },
];
