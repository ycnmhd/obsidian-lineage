import { LineageDocument } from 'src/stores/document/document-type';
import { sortGroups } from 'src/stores/document/reducers/state/helpers/sort-groups';

export const cleanAndSortColumns = (
    document: Pick<LineageDocument, 'columns'>,
) => {
    const emptyColumns: Set<string> = new Set();
    const columns = document.columns;
    for (let i = 1; i < columns.length; i++) {
        const column = columns[i];

        column.groups = column.groups.filter((g) => g.nodes.length > 0);
        if (column.groups.length === 0) {
            emptyColumns.add(column.id);
        }
    }
    document.columns = columns.filter((c) => !emptyColumns.has(c.id));
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
