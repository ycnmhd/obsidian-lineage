export const lang = {
    open_in_editor: 'Open in editor',
    open_in_lineage: 'Open in Lineage',
    toggle_lineage_view: 'Toggle view',
    export_document: 'Export document',
    create_new_file: 'Create new document',
    new_file: 'New lineage document',
    format_headings: 'Format headings',
    extract_branch: 'Extract branch to a new document',
    error_apply_snapshot_while_editing: 'Cannot apply a snapshot while editing',
    error_delete_last_node: 'Cannot delete the last card',
    error_generic:
        'Something went wrong\nFurther details may be available in the developer console',
    cant_split_card_that_has_children: 'Cannot split a card that has children',
    cant_split_card: 'Could not split this card',

    error_parent_not_found: (full: string) =>
        `Could not find the parent section of ${full}`,
};
