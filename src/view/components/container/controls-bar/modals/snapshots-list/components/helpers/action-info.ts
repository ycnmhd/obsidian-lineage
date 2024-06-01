import {
    ClipboardPaste,
    FileEdit,
    FileMinus,
    FileOutput,
    FilePlus,
    FileSymlink,
    FileUp,
    Heading1,
    Merge,
    Scissors,
    Split,
} from 'lucide-svelte';
import { UndoableAction } from 'src/stores/document/document-store-actions';
import { Snapshot } from 'src/stores/document/document-state-type';

type Key = UndoableAction['type'];
export const actionInfo: Partial<
    Record<
        Key,
        (snapshot: Snapshot) => { label: string; icon: typeof FileEdit }
    >
> = {
    'DOCUMENT/SET_NODE_CONTENT': (snapshot) => ({
        label: 'Updated card ' + snapshot.context.affectedSection,
        icon: FileEdit,
    }),
    'DOCUMENT/INSERT_NODE': (snapshot) => ({
        label: 'Created card ' + snapshot.context.affectedSection,
        icon: FilePlus,
    }),
    'DOCUMENT/DROP_NODE': (snapshot) => ({
        label: 'Dropped card ' + snapshot.context.affectedSection,
        icon: FileOutput,
    }),
    'DOCUMENT/LOAD_FILE': () => ({
        label: 'Loaded document',
        icon: FileUp,
    }),
    'DOCUMENT/DELETE_NODE': (snapshot) => ({
        label: 'Deleted card ' + snapshot.context.affectedSection,
        icon: FileMinus,
    }),
    'DOCUMENT/MOVE_NODE': (snapshot) => ({
        label: 'Moved card ' + snapshot.context.affectedSection,
        icon: FileOutput,
    }),
    'DOCUMENT/MERGE_NODE': (snapshot) => ({
        label: 'Merged card ' + snapshot.context.affectedSection,
        icon: Merge,
    }),
    'DOCUMENT/FORMAT_HEADINGS': () => ({
        label: 'Formatted headings',
        icon: Heading1,
    }),
    'DOCUMENT/CUT_NODE': (snapshot) => ({
        label: 'Cut card ' + snapshot.context.affectedSection,
        icon: Scissors,
    }),
    'DOCUMENT/PASTE_NODE': (snapshot) => ({
        label: 'Pasted card ' + snapshot.context.affectedSection,
        icon: ClipboardPaste,
    }),
    'DOCUMENT/EXTRACT_BRANCH': (snapshot) => ({
        label: 'Extracted card ' + snapshot.context.affectedSection,
        icon: FileSymlink,
    }),
    'DOCUMENT/SPLIT_NODE': (snapshot) => ({
        label: 'Split card ' + snapshot.context.affectedSection,
        icon: Split,
    }),
};
