import { eventToString } from 'src/view/actions/keyboard-shortcuts/helpers/keyboard-events/event-to-string';
import { viewHotkeys } from 'src/view/actions/keyboard-shortcuts/helpers/commands/update-view-hotkeys-dictionary';
import { onPluginError } from 'src/lib/store/on-plugin-error';
import {
    GlobalKeyboardContext,
    routeGlobalCommand,
} from './global-view-keyboard';

/**
 * Svelte action that gives the global categories view the same keyboard
 * navigation as the main Lineage view. Hotkey bindings (default AND
 * user-defined) are resolved through the shared `viewHotkeys` dictionary, so
 * custom remaps apply here automatically.
 */
export const globalViewHotkeysAction = (
    target: HTMLElement,
    ctx: GlobalKeyboardContext,
) => {
    const keyboardEventHandler = (event: KeyboardEvent) => {
        if ((event.target as HTMLElement).localName === 'input') return;
        const command = viewHotkeys.current[eventToString(event)];
        if (!command) return;
        const editing = Boolean(
            ctx.viewStore.getValue().document.editing.activeNodeId,
        );
        const allow =
            command.editorState === 'editor-on'
                ? editing
                : command.editorState === 'editor-off'
                  ? !editing
                  : true;
        if (!allow) return;
        try {
            routeGlobalCommand(command.name, event, target, ctx);
        } catch (error) {
            onPluginError(error, 'command', command);
        }
    };

    target.addEventListener('keydown', keyboardEventHandler);
    return {
        destroy: () => {
            target.removeEventListener('keydown', keyboardEventHandler);
        },
    };
};
