import { LineageView } from 'src/view/view';
import { derived } from 'src/lib/store/derived';
import { Column, NodeGroup } from 'src/stores/document/document-state-type';

export const findColumn = (columns: Column[], columnId: string) => {
    return columns.find((c) => c.id === columnId);
};

export const groupsStore = (view: LineageView, columnId: string) => {
    let column: Column | undefined;
    let columns: Column[];
    return derived(view.documentStore, (state) => {
        if (!column || columns !== state.document.columns) {
            columns = state.document.columns;
            column = findColumn(columns, columnId);
            if (!column) return [] as NodeGroup[];
        }
        return column.groups;
    });
};
