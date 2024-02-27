<script lang="ts">
	import { ActiveStatus } from '../../../active-status.enum';

	export let editing: boolean;
    export let hasChildren: boolean;
    export let active: ActiveStatus | null;
    export let parentId: string;
</script>

{#if !editing && hasChildren && active === ActiveStatus.node}
    <div class="active-node-bridge"></div>
{:else if active === ActiveStatus.parent}
    <div class={'active-parent-bridge-right'}></div>
    {#if !parentId.startsWith('r-')}
        <div class="active-parent-bridge-left"></div>
    {/if}
{/if}

<style>
	.active-node-bridge,
	.active-parent-bridge-right,
	.active-parent-bridge-left {
		height: 100%;

		width: 10px;
		position: absolute;
		top: 0;
	}

	.active-parent-bridge-right {
		right: -10px;
		background-color: var(--background-active-parent);
	}

	.active-parent-bridge-left {
		left: -10px;
		background-color: var(--background-active-parent);
	}
	.active-node-bridge {
		right: -10px;
		background-color: var(--background-active-node);
	}
</style>
