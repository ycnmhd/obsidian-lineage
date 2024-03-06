<script lang="ts">
	import { ActiveStatus } from '../../../active-status.enum';
	import DeleteNodeButton from './delete-node-button.svelte';
	import EditNodeButton from './edit-node-button.svelte';
	import CreateCardButton from './create-card-button.svelte';

	export let editing: boolean;
export let active: ActiveStatus | null;
</script>
{#if active === ActiveStatus.node}
	{#if !editing}
		<CreateCardButton position="up" />
		<CreateCardButton position="right" />
		<CreateCardButton position="down" />
		<DeleteNodeButton />
	{/if}
	<EditNodeButton {editing} />
{/if}
