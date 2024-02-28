import { Store } from 'src/helpers/store';
import {
    FileHistoryAction,
    fileHistoryReducer,
    FileHistoryState,
} from 'src/stores/file-history/file-history-reducer';

export const fileHistoryStore = new Store<FileHistoryState, FileHistoryAction>(
    {
        documents: {},
    },
    fileHistoryReducer,
);
