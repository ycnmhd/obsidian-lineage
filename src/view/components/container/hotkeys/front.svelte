<script lang="ts">
    import { hotkeyStore } from 'src/stores/hotkeys/hotkey-store';

    let searchTerm = '';

    $: {
        hotkeyStore.dispatch({
            type: 'UI/SET_SEARCH_TERM',
            payload: {
                searchTerm,
            },
        });
    }
</script>
<div class="front">
    <div class="search-input-container">
        <input
            bind:value={searchTerm}
            class="search-input"
            enterkeyhint="search"
            placeholder={'Filter'}
            spellcheck="false"
            type="search"
        />
        <div
            aria-label={'Clear'}
            class="search-input-clear-button"
            on:click={() => {
                    searchTerm = '';
                }}
        ></div>
    </div>
</div>
<style>
    .front {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding:0 var(--size-4-2);
    }
    .title {
        font-size: 16px;
        color: var(--color-base-70);
    }
    .search-input-container {
        width: 100%;
    }
</style>
