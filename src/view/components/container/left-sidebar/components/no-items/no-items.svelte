<script lang="ts">

    import { lang } from 'src/lang/lang';

    export let variant: 'recent'|'pinned'|'similar'

</script>

<div class="pane-empty">
    {#if variant === 'pinned'}
        {lang.sidebar_no_pinned_nodes}
    {:else if variant === 'recent'}
        {lang.sidebar_no_recent_nodes}
    {:else}
        {lang.sidebar_no_similar_cards}
    {/if}
</div>
