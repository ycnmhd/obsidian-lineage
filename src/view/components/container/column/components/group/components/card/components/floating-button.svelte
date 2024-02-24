<script lang="ts">
	import classNames from 'classnames';

	export let classes = '';
    export let position: keyof typeof positionClasses;
    const positionClasses = {
        top: 'position-top',
        right: 'position-right',
        bottom: 'position-bottom',
        'bottom-right': 'position-bottom-right',
        'top-right': 'position-top-right',
    };
</script>

<button
    class={classNames(classes, positionClasses[position])}
	on:click
>
    <slot />
</button>

<style>
    :root {
        --floating-button-width: 30px;
        --floating-button-height: 20px;
        --node-width: 400px;
        --floating-button-bg: #dbdbdb;
    }
    button {
        color: black;
        width: var(--floating-button-width);
        height: var(--floating-button-height);
        position: absolute;
        opacity: 0.3;
        background-color: var(--floating-button-bg);
        transition: opacity 200ms;
        padding: 8px;
        cursor: pointer;
    }
	.is-disabled{
		cursor: not-allowed;
	}
    button:not(.is-disabled):hover {
        opacity: 8;
    }

    .position-top {
        /*top: calc((-1 * var(--height)) / 2);*/
        top: 0;
        left: calc(50% - calc(var(--floating-button-width) / 2));
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
    .position-bottom {
        /*bottom: calc((-1 * var(--height)) / 2);*/
        bottom: 0;
        left: calc(50% - calc(var(--floating-button-width) / 2));
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    .position-right {
        top: calc(50% - calc(var(--floating-button-height) / 2));
        /*right: calc((1 * var(--width)));*/
        right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .position-bottom-right {
        bottom: 0;
        right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }
    .position-top-right {
        top: 0;
        right: 0;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        border-top-left-radius: 0;
    }
</style>
