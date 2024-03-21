<script lang="ts">
    import classNames from 'classnames';
    import { Direction } from 'src/stores/document/document-store-actions';

    export let classes = '';
    export let position: Direction | 'down-right' | 'up-right';
    export let label: string
    const positionClasses = {
        up: 'position-top',
        right: 'position-right',
        down: 'position-bottom',
        'down-right': 'position-bottom-right',
        'up-right': 'position-top-right',
    };
</script>

<button
    aria-label={label}
    class={classNames(
        classes,
        positionClasses[position],
        'lineage__floating-button',
    )}
    on:click
>
    <slot />
</button>

<style>
    :root {
        --floating-button-width: 30px;
        --floating-button-height: 30px;
        --node-width: 400px;
        --floating-button-bg: #dbdbdb;
        --position-tb: -10px;
        --position-lr: -4px;
    }
    button {
        color: var(--color-acive-node);
        width: var(--floating-button-width);
        height: var(--floating-button-height);
        position: absolute;
        opacity: 0;
        box-shadow: none;
        border: none;
        background-color: transparent;
        transition: opacity 200ms;
        padding: 8px;
        cursor: pointer;
    }
    .is-disabled {
        cursor: not-allowed;
    }
    button:not(.is-disabled):hover {
        opacity: 8;
    }

    .position-top {
        /*top: calc((-1 * var(--height)) / 2);*/
        top: var(--position-tb);
        left: calc(50% - calc(var(--floating-button-width) / 2));
    }
    .position-bottom {
        /*bottom: calc((-1 * var(--height)) / 2);*/
        bottom: var(--position-tb);
        left: calc(50% - calc(var(--floating-button-width) / 2));
    }
    .position-right {
        top: calc(50% - calc(var(--floating-button-height) / 2));
        right: var(--position-lr);
    }

    .position-bottom-right {
        top: var(--position-lr);
        right: var(--position-lr);
    }
    .position-top-right {
        top: var(--position-lr);
        right: 16px;
    }
</style>
