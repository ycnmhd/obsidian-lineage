<script lang="ts">

	export let content: string
</script>

<div
    class="content"

>
    {#each content.split('\n') as line}
        <span>{line}</span><br />
    {/each}
</div>

<style>
	.content {
		width: 100%;
		min-height: 100px;
		padding: 6px;
		font-size: 16px;
	}
</style>
