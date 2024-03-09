<script lang="ts">
    import { Hotkey } from 'obsidian';
    import { RotateCcw, X } from 'lucide-svelte';

    import { CommandName } from 'src/view/actions/keyboard-shortcuts/helpers/commands/command-names';
    import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';
    import { Modifiers } from 'src/view/actions/keyboard-shortcuts/helpers/commands/update-commands-dictionary';

    export let hotkey: Hotkey;
    export let commandName: CommandName;
    export let isPrimary: boolean;
    export let onCancel: () => void;

    let key = hotkey.key;
    let CTRL = hotkey.modifiers.includes('Ctrl');
    let SHIFT = hotkey.modifiers.includes('Shift');
    let ALT = hotkey.modifiers.includes('Alt');

    // eslint-disable-next-line no-undef
    const onKeyDown = (e: KeyboardEvent) => {
        e.preventDefault();
        if (e.shiftKey || e.ctrlKey || e.altKey) return;
        if (e.key === ' ' || e.key==="META") return;
        const value = e.key.toUpperCase();
        key = value.length === 1 ? value.toUpperCase() : value;
        save();
    };

    const toggleCtrl = () => {
        CTRL = !CTRL;
        save();
    };
    const toggleShift = () => {
        SHIFT = !SHIFT;
        save();
    };
    const toggleAlt = () => {
        ALT = !ALT;
        save();
    };

    const save = () => {
        let modifiers: Hotkey['modifiers'] =[]

        if (CTRL) modifiers.push('Ctrl');
        if (SHIFT) modifiers.push('Shift');
        if (ALT) modifiers.push('Alt');
        hotkeyStore.dispatch({
            type: 'HOTKEY/UPDATE',
            payload: {
                hotkey: {
                    key,
                    modifiers,
                },
                primary: isPrimary,
                command: commandName,
            },
        });
    };
    // eslint-disable-next-line no-undef
    const reset = () => {
        hotkeyStore.dispatch({
            type: 'HOTKEY/RESET',
            payload: {
                command: commandName,
                primary: isPrimary,
            },
        });
        setTimeout(() => {
            CTRL = hotkey.modifiers.includes('Ctrl');
            ALT = hotkey.modifiers.includes('Alt');
            SHIFT = hotkey.modifiers.includes('Shift');
            key = hotkey.key
        });
    };
</script>

<div class="container">
    <div class="hotkey-container">
        <div class="modifiers">
            <kbd class={!CTRL ? 'disabled' : ''} on:click={toggleCtrl}
                >{Modifiers.Ctrl}</kbd
            >
            <kbd class={!ALT ? 'disabled' : ''} on:click={toggleAlt}
                >{Modifiers.Alt}</kbd
            >
            <kbd class={!SHIFT ? 'disabled' : ''} on:click={toggleShift}
                >{Modifiers.Shift}</kbd
            >
        </div>
        <input
            bind:value={key}
            class="search-input input"
            on:keydown={onKeyDown}
            placeholder={'Key'}
            spellcheck="false"
            type="text"
        />
    </div>
    <div class="save-and-cancel-buttons">
        <button aria-label="Reset" class="hotkey-button"
                on:click={reset}
            ><RotateCcw class="svg-icon" size={8} /></button
        >
        <button aria-label="Go back" class="hotkey-button"
                on:click={onCancel}
            ><X class="svg-icon" size={8} /></button
        >
    </div>
</div>

<style>
    .container {
        display: flex;
        gap: 5px;
        align-items: center;
        justify-content: center;
    }
    .hotkey-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }
    .input {
        width: 115px;
        height: 25px;
        text-align: center;
    }

    .modifiers {
        display: flex;
        gap: 5px;
        width: 100%;
        justify-content: center;
    }

    .disabled {
        background-color: var(--color-base-50);
    }

    .save-and-cancel-buttons {
        display: flex;
        gap: 5px;
        flex-direction: column;
    }
    .hotkey-button {
        background-color: transparent;
        color: var(--color-base-25);
        border: none;
        width: 20px;
        height: 20px;
        box-shadow: none;
        padding: 2px;
        cursor: pointer;
    }
</style>
