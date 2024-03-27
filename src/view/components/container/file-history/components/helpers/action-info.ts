import {
    FileEdit,
    FileMinus,
    FileOutput,
    FilePlus,
    FileUp,
    Merge,
} from 'lucide-svelte';
import { UndoableAction } from 'src/stores/document/document-store-actions';

type Key = UndoableAction['type'];
export const actionInfo: Partial<
    Record<Key, { label: string; icon: typeof FileEdit }>
> = {
    'DOCUMENT/SET_NODE_CONTENT': { label: 'Updated a node', icon: FileEdit },
    'DOCUMENT/INSERT_NODE': { label: 'Created a node', icon: FilePlus },
    'DOCUMENT/DROP_NODE': { label: 'Dropped a node', icon: FileOutput },
    'DOCUMENT/LOAD_FILE': { label: 'Loaded document', icon: FileUp },
    'DOCUMENT/DELETE_NODE': { label: 'Deleted a node', icon: FileMinus },
    'DOCUMENT/MOVE_NODE': { label: 'Moved a node', icon: FileOutput },
    'DOCUMENT/MERGE_NODE': { label: 'Merged a node', icon: Merge },
};
