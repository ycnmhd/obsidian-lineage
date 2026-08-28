export const lang = {
    // open
    ocm_open_in_editor: 'Open in editor',
    ocm_open_in_lineage: 'Open in Lineage',
    cmd_toggle_lineage_view: 'Toggle view',
    card_btn_reveal_in_editor: 'Reveal in editor',
    error_parent_not_found: (full: string) =>
        `Could not find the parent section of ${full}`,
    modals_snapshots_document_loaded: 'Opened document',
    error_set_empty_data: 'Data is empty, but the file on disk is not',
    error_save_empty_data: "Can't save empty data",

    // create document
    cmd_create_new_document: 'Create new document',
    ocm_new_document: 'New document',
    ocm_import_from_gingko: 'Import from Gingko',

    // add sections
    hk_add_below_and_split: 'Add section after and split at cursor',
    card_btn_add_node_below: 'Add section after',
    hk_add_above_and_split: 'Add section before and split at cursor',
    card_btn_add_node_above: 'Add section before',
    hk_add_parent_sibling: 'Add section after parent',
    hk_add_child_and_split: 'Add subsection and split at cursor',
    card_btn_add_child_node: 'Add subsection',
    hkg_create_nodes: 'Create',
    modals_snapshots_created_node: 'Created section ',

    // edit
    settings_general_maintain_edit_mode: 'Maintain editing mode',
    settings_general_maintain_edit_mode_desc:
        'Maintain editing mode when switching to a different card using the mouse or keyboard',
    card_btn_edit: 'Edit',
    hk_enable_edit_mode: 'Edit section',
    hk_enable_edit_mode_and_place_cursor_at_start:
        'Edit section and place cursor at the start',
    hk_enable_edit_mode_and_place_cursor_at_end:
        'Edit section and place cursor at the end',
    hkg_edit_nodes: 'Edit',
    modals_snapshots_updated_node: 'Updated section ',
    modal_hk_editor_state_on: 'Enable only when the editor is active',
    modal_hk_editor_state_off: 'Enable only when the editor is inactive',
    modal_hk_editor_state_both: 'Enable regardless of the editor state',

    // save
    card_btn_save: 'Save',
    hk_save_changes: 'Save changes and exit editor',
    hk_disable_edit_mode: 'Cancel changes',

    // delete
    card_btn_delete: 'Delete',
    hk_delete_section: 'Delete section',
    error_delete_last_node: 'Cannot delete this section',
    hkg_delete_nodes: 'Delete',
    modals_snapshots_deleted_section: 'Deleted section ',

    // clipboard
    cm_copy: 'Copy',
    cm_copy_branches: 'Copy branches',
    cm_copy_branch: 'Copy branch',
    cm_copy_branches_wo_formatting: 'Copy branches as plain text',
    cm_copy_branch_wo_formatting: 'Copy branch as plain text',
    cm_copy_node_wo_subitems: 'Copy sections',
    cm_copy_nodes_wo_subitems: 'Copy section',
    hk_copy_node: 'Copy branch',
    hk_copy_node_unformatted: 'Copy branch as plain text',
    hk_copy_node_without_subitems: 'Copy section',
    cm_copy_link_to_block: 'Copy link to block',
    toolbar_copy_search_results: 'Copy search results',
    toolbar_copy_search_results_wo_subitems:
        'Copy search results without sub-items',
    toolbar_cut_search_results: 'Cut search results',
    hkg_clipboard: 'Clipboard',
    modals_snapshots_cut_section: 'Cut section ',
    cm_cut: 'Cut',
    hk_cut_node: 'Cut branch',
    cm_paste: 'Paste',
    hk_paste_node: 'Paste branch',
    modals_snapshots_pasted_section: 'Pasted section ',
    error_cant_paste: 'Paste command failed. Try pasting directly into a card',
    /*hk_notice_copy: (
        size: number,
        formatted: boolean,
        type: 'branch' | 'section',
    ) => {
        if (size === 0) return null;
        return type === 'branch'
            ? size === 1
                ? formatted
                    ? null
                    : 'Unformatted branch copied to clipboard'
                : formatted
                  ? `${size} branches copied to clipboard`
                  : `${size} unformatted branches copied to clipboard`
            : size === 1
              ? null
              : size + ' sections copied to clipboard';
    },*/

    // merge
    cm_merge_above: 'Merge with branch above',
    cm_merge_below: 'Merge with branch below',
    hk_merge_with_node_above: 'Merge with branch above',
    hk_merge_with_node_below: 'Merge with branch below',
    error_hk_cant_merge_multiple_nodes: 'Cannot merge multiple branches',
    hkg_merge_nodes: 'Merge',
    modals_snapshots_merged_node: 'Merged section ',

    // move
    hk_move_node_up: 'Move branch up',
    hk_move_node_down: 'Move branch down',
    hk_move_node_right: 'Move branch right',
    hk_move_node_left: 'Move branch left',
    hkg_move_nodes: 'Move',
    modals_snapshots_moved_node: 'Moved section ',

    // dnd
    modals_snapshots_dropped_node: 'Dropped section ',

    // split
    cm_split_node: 'Split section',
    error_cm_cant_split_node_that_has_children:
        'Cannot split a section that has sub-items',
    error_cm_cant_split_node_identical: 'The result is the same as the input',
    modals_snapshots_split_node: 'Split section ',

    // undo
    controls_history: 'History',
    controls_history_undo: 'Undo',
    controls_history_redo: 'Redo',
    hk_undo_change: 'Undo change',
    hk_redo_change: 'Redo change',
    error_apply_snapshot_while_editing: 'Cannot apply a snapshot while editing',
    hkg_history: 'History',

    // extract
    cmd_extract_branch: 'Extract branch to a new document',
    cm_extract_branch: 'Extract branch',
    cm_extract_section: 'Extract section',
    modals_snapshots_extracted_node: 'Extracted section ',

    // export
    cm_export_document: 'Export document',
    cm_eject_document: 'Eject document',
    cm_export_selection: 'Export',
    cm_export_section: 'Export section',
    cm_export_branch_with_subitems: 'Export branch',
    cm_export_branch_wo_subitems: 'Export section',
    cmd_export_branches_with_subitems: 'Export branches',
    cmd_export_nodes_wo_subitems: 'Export sections',

    // document format
    settings_general_default_format: 'Default format',
    cm_document_format: 'Document format',
    settings_format_html_elements: 'HTML elements (experimental)',
    settings_format_html_comments: 'HTML comments',
    settings_format_outline: 'Outline',
    cm_change_format_to_html_element: 'Format: HTML elements (experimental)',
    cm_change_format_to_document: 'Format: HTML comments',
    cm_change_format_to_outline: 'Format: outline',

    // format
    cm_format_headings: 'Format headings',
    modals_snapshots_formatted_headings: 'Formatted headings',

    // search
    tlb_search_toggle: 'Toggle search input',
    tlb_search_show_all_nodes: 'Show all sections',
    tlb_search_fuzzy_search: 'Fuzzy search',
    tlb_search_previous_result: 'Previous result',
    tlb_search_next_result: 'Next result',
    tlb_search_clear: 'Clear',
    hk_toggle_search_input: 'Toggle search',
    hkg_search: 'Search',

    // select
    hk_extend_select_up: 'Extend selection up',
    hk_extend_select_down: 'Extend selection down',
    hk_extend_select_to_start_of_group: 'Extend selection to start of group',
    hk_extend_select_to_end_of_group: 'Extend selection to end of group',
    hk_extend_select_to_start_of_column: 'Extend selection to start of column',
    hk_extend_select_to_end_of_column: 'Extend selection to end of column',
    hkg_selection: 'Select',
    hk_select_all: 'Select all sections',

    // navigate spatially
    hk_navigate_to_next_node: 'Select next section',
    hk_navigate_to_previous_node: 'Select previous section',
    hk_go_up: 'Go up',
    hk_go_down: 'Go down',
    hk_go_right: 'Go right',
    hk_go_Left: 'Go left',
    hk_go_to_beginning_of_group: 'Go to start of group',
    hk_go_to_end_of_group: 'Go to end of group',
    hk_go_to_beginning_of_column: 'Go to start of column',
    hk_go_to_end_of_column: 'Go to end of column',
    hk_select_parent: 'Select parent section',
    hkg_navigation: 'Navigate',
    hk_select_previous_sibling: 'Select previous sibling',
    hk_select_next_sibling: 'Select next sibling',

    // navigate node history
    hk_navigate_back: 'Navigate back',
    hk_navigate_forward: 'Navigate forward',
    tlb_navigation_navigate_back: 'Navigate back',
    tlb_navigation_navigate_forward: 'Navigate forward',

    // zoom
    controls_zoom_in: 'Zoom in',
    controls_zoom_out: 'Zoom out',
    controls_zoom_reset: 'Reset (hold shift to undo)',
    controls_zoom_presets: 'Zoom menu',
    hk_zoom_in: 'Zoom in',
    hk_zoom_out: 'Zoom out',
    hk_zoom_reset: 'Reset zoom',
    hkg_zoom: 'Zoom',

    // scroll
    hk_scroll_left: 'Scroll left',
    hk_scroll_right: 'Scroll right',
    hk_scroll_up: 'Scroll up',
    hk_scroll_down: 'Scroll down',
    hk_align_branch: 'Center active branch',

    controls_toggle_scrolling_mode_horizontal:
        'Always center active card horizontally',
    controls_toggle_scrolling_mode_vertical:
        'Always center active card vertically',
    cmd_toggle_horizontal_scrolling_mode: `Toggle 'always center active card horizontally'`,
    cmd_toggle_vertical_scrolling_mode: `Toggle 'always center active card vertically'`,
    card_btn_scroll_to_reveal: 'Reveal',
    hkg_scrolling: 'Scroll',

    // theme
    settings_theme_bg: 'Background color',
    settings_theme_active_branch_bg: 'Active branch background color',
    settings_theme_active_branch_color: 'Active branch text color',
    settings_appearance_font_size: 'Font size',
    settings_appearance_headings_font_size: 'Headings font size (em)',
    settings_appearance_inactive_node_opacity: 'Inactive cards opacity',

    // layout
    settings_layout_card_width: 'Card width',
    settings_layout_limit_card_height: 'Limit card height',
    settings_always_show_card_buttons: 'Show buttons on all cards',
    settings_always_show_card_buttons_desc:
        'Show card buttons on all cards, not just the active one',

    // outline
    settings_layout_indentation_width: 'Card indentation',
    controls_single_column: 'Outline mode',
    hk_toggle_outline_mode: `Toggle outline mode`,

    // mindmap
    controls_mindmap_mode: 'Mindmap mode',
    hk_toggle_mindmap_mode: `Toggle mindmap mode`,
    card_btn_collapse_node: 'Collapse',
    card_btn_expand_node: 'Expand',
    hk_outline_toggle_collapse: 'Collapse/expand section',
    hk_outline_toggle_collapse_all: 'Collapse/expand all sections',
    hkg_outline: 'Outline',

    // toolbar
    settings_vertical_toolbar_icons: 'Vertical toolbar buttons',
    settings_vertical_toolbar_icons_desc:
        'Configure what buttons appear in the vertical toolbar',

    // space between cards
    controls_gap_between_cards: 'Space between cards',
    cmd_space_between_cards: `Toggle 'space between cards'`,
    settings_layout_space_between_cards: 'Space between cards',

    // sidebar
    toolbar_toggle_left_sidebar: 'Left sidebar',
    controls_toggle_minimap: 'Document minimap',
    cmd_toggle_minimap: 'Toggle document minimap',
    cmd_toggle_left_sidebar: 'Toggle left sidebar',
    cmd_toggle_zen_mode: 'Toggle zen mode',

    // recent sections
    sidebar_tab_recent_nodes: 'Recently selected sections',
    sidebar_no_recent_nodes: 'No recent sections',

    // pin sections
    cm_unpin_from_left_sidebar: 'Unpin from left sidebar',
    cm_pin_in_left_sidebar: 'Pin in left sidebar',
    cm_reveal_in_left_sidebar: 'Reveal in left sidebar',
    cm_reveal_in_main_view: 'Reveal in main view',
    cmd_toggle_pin_in_left_sidebar: `Toggle 'pin section in left sidebar'`,
    sidebar_tab_pinned_nodes: 'Pinned sections',
    sidebar_no_pinned_nodes: 'No pinned sections',

    // similar cards
    sidebar_tab_similar_cards: 'Similar cards',
    sidebar_no_similar_cards:
        'No similar cards found.\nRun "Find: Similar chunks from selection" to populate.',
    similar_cards_query: 'Search query:',
    similar_cards_score: 'Similarity:',
    similar_cards_score_label: (pct: number) => `${pct}% similar`,

    // categories
    sidebar_filter_all: 'All',
    sidebar_filter_uncategorized: 'Uncategorized',
    cm_category: 'Category',
    cm_create_category: 'Create new category...',
    cm_remove_category: 'Remove category',
    cm_delete_category: 'Delete category',
    modal_new_category_placeholder: 'Enter category name...',
    modal_button_cancel: 'Cancel',
    modal_button_create: 'Create',

    // global categories
    cm_global_categories: 'Global categories',
    cm_open_global_categories: 'Open global categories…',
    cm_new_folder: 'New folder',
    cm_new_category: 'New category',
    cm_rename: 'Rename',
    cm_delete: 'Delete',
    cm_move: 'Move',
    cm_remove_from_category: 'Remove from category',
    cm_open_in_lineage: 'Open in Lineage',
    cmd_open_global_categories: 'Open global categories',
    cmd_add_card_to_global_category: 'Add current card to global category',
    add_to_global_category_title: 'Add to global category',
    add_to_global_category_select_directory: 'Select a directory',
    add_to_global_category_select_category: 'Select a category',
    add_to_global_category_create_directory: 'New directory…',
    add_to_global_category_create_category: 'New category…',
    add_to_global_category_not_in_any:
        'This card is not in any global category',
    add_to_global_category_in_categories: 'Already in global category:',
    add_to_global_category_reveal: 'Reveal in global view',
    global_categories_view_title: 'Global categories',
    global_categories_empty_tree:
        'No folders or categories yet. Right-click to create one.',
    global_categories_empty_cards:
        'No cards in this selection yet. Pin a card in the sidebar and add it to a global category.',
    global_categories_select_node:
        'Select a folder or category to see its cards.',
    global_categories_open_in_file: 'Open "{filename}" in the Lineage view',
    global_categories_move_up: 'Move card up',
    global_categories_move_down: 'Move card down',
    global_categories_toggle_label: 'Global categories',
    global_categories_toggle_title: 'Show global categories in the sidebar',
    global_categories_all_directories: 'All directories',
    global_categories_all_categories: 'All categories',
    global_categories_select_directory: 'Select directory…',
    global_categories_select_category: 'Select category…',
    global_categories_search_directory: 'Search directories…',
    global_categories_search_category: 'Search categories…',
    global_categories_no_matches: 'No matches',
    global_categories_manage_tree: 'Manage tree',
    global_categories_search_cards: 'Search cards…',
    global_categories_search_no_results: 'No cards match your search.',
    modal_new_folder_placeholder: 'Enter folder name...',
    modal_rename_placeholder: 'Enter new name...',

    // rules
    modals_rules_add_rule: 'New rule',
    modals_rules_no_rules: 'No rules',
    controls_rules: 'Card style rules',
    modals_rules_matches: 'Number of matches',
    modals_rules_drag_handle: 'Change priority',
    modals_rules_tab_global_rules: 'Global rules',
    modals_rules_tab_document_rules: 'Document rules',
    modals_rules_rule_cm_move_to_document: 'Move to document rules',
    modals_rules_rule_cm_move_to_global: 'Move to global rules',

    // sort
    cmd_sort_child_nodes_asc: 'Sort subsections: ascending order',
    cmd_sort_child_nodes_desc: 'Sort subsections: descending order',
    cm_sort_child: 'Sort subsections',
    cm_sort_child_nodes_asc: 'Ascending order',
    cm_sort_child_nodes_desc: 'Descending order',
    modals_snapshots_sorted_child_nodes: 'Sorted subsections of section ',

    // settings
    controls_settings: 'Settings',
    controls_toggle_bar: 'Toggle controls bar',
    settings_appearance: 'Appearance',
    settings_layout: 'Layout',
    settings_reset: 'Reset',

    // general settings
    settings_general_link_split: 'Open in new split',
    settings_general_link_tab: 'Open in new tab',
    settings_general_link_behavior: 'Default link behavior',

    // hotkeys
    modals_hk_input_placeholder: 'Filter',
    modals_hk_editor_cancel: 'Cancel',
    controls_hotkeys: 'Hotkeys',
    modals_hk_reset_hotkeys: 'Reset all hotkeys',
    modals_hk_load_alt_hotkeys_preset:
        "Apply preset: use 'Alt' as the primary modifier",

    modals_hk_load_nav_while_editing_preset:
        "Apply preset: navigate while editing using 'Alt+Shift+Arrow keys'",
    error_generic:
        'Something went wrong\nYou might find additional details in the developer console',
} as const;
