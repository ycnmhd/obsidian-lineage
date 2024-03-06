import { Modifiers } from 'src/view/actions/keyboard-shortcuts/keyboard-shortcuts';

export const eventToString = (event: KeyboardEvent) => {
    let string = event.key.toUpperCase();
    if (event.altKey) string += Modifiers.Alt;
    if (event.ctrlKey) string += Modifiers.Ctrl;
    if (event.shiftKey) string += Modifiers.Shift;
    return string;
};
