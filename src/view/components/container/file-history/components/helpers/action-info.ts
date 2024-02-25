import {
    File,
    FileClock,
    FileEdit,
    FileMinus,
    FileOutput,
    FilePlus,
} from 'lucide-svelte';

export const actionInfo: Record<
    string,
    { label: string; icon: typeof FileEdit }
> = {
    SET_NODE_CONTENT: { label: 'Updated a node', icon: FileEdit },
    CREATE_FIRST_NODE: { label: 'Created a node', icon: FilePlus },
    CREATE_NODE: { label: 'Created a node', icon: FilePlus },
    DROP_NODE: { label: 'Moved a node', icon: FileOutput },
    APPLY_SNAPSHOT: { label: 'Applied a snapshot', icon: FileClock },
    INITIAL_DOCUMENT: { label: 'Initial document', icon: File },
    'TREE/DELETE_NODE': { label: 'Deleted a node', icon: FileMinus },
};
