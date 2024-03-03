import { Column } from 'src/stores/view/view-state-type';
import { sortGroups } from 'src/stores/view/reducers/document/state/helpers/sort-groups';

export const cleanAndSortColumns = (columns: Column[]) => {
    const emptyColumns: Set<string> = new Set();

    for (let i = 1; i < columns.length; i++) {
        const column = columns[i];

        column.groups = column.groups.filter((g) => g.nodes.length > 0);
        if (column.groups.length === 0) {
            emptyColumns.add(column.id);
        }
    }
    for (const emptyColumn of emptyColumns) {
        const i = columns.findIndex((c) => c.id === emptyColumn);
        if (i > 0) columns.splice(i, 1);
    }

    for (let i = 1; i < columns.length; i++) {
        const column = columns[i];
        if (column.groups.length) {
            const previousColumn = columns[i - 1];
            if (column.groups.length > 0) {
                column.groups = sortGroups(
                    previousColumn.groups,
                    column.groups,
                );
            }
        }
    }
};
