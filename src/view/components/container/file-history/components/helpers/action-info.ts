import {
    File,
    FileClock,
    FileEdit,
    FileMinus,
    FileOutput,
    FilePlus,
    Merge,
} from 'lucide-svelte';
import { DocumentAction } from 'src/stores/document/document-reducer';
import { FileHistoryAction } from 'src/stores/file-history/file-history-reducer';

type Key = DocumentAction['type'] | FileHistoryAction['type'];
export const actionInfo: Partial<
    Record<Key, { label: string; icon: typeof FileEdit }>
> = {
    SET_NODE_CONTENT: { label: 'Updated a node', icon: FileEdit },
    CREATE_NODE: { label: 'Created a node', icon: FilePlus },
    DROP_NODE: { label: 'Dropped a node', icon: FileOutput },
    APPLY_SNAPSHOT: { label: 'Applied a snapshot', icon: FileClock },
    'FILE/LOAD_DOCUMENT': { label: 'Initial document', icon: File },
    'TREE/DELETE_NODE': { label: 'Deleted a node', icon: FileMinus },
    MOVE_NODE: { label: 'Moved a node', icon: FileOutput },
    MERGE_NODE: { label: 'Merged a node', icon: Merge },
};
