<script lang="ts">
    import Button from '../../shared/button.svelte';
    import { PanelLeftDashed } from 'lucide-svelte';
    import { getView } from 'src/view/components/container/context';
    import { ShowLeftSidebarStore } from 'src/stores/settings/derived/view-settings-store';
    import { lang } from 'src/lang/lang';

    const view = getView();


    const show = ShowLeftSidebarStore(view);
    const toggleLeftSidebar = () => {
        view.viewStore.dispatch({ type: 'view/left-sidebar/toggle' });
    };
</script>

<div class="buttons-group" style="overflow: inherit">
    <div class="badge-container">
        <Button
            on:click={toggleLeftSidebar}
            active={$show}
            label={lang.toolbar_toggle_left_sidebar}

            tooltipPosition="bottom"
        >
            <PanelLeftDashed class="svg-icon" size="32" />
        </Button>

    </div>
</div>

<style>
    .badge-container {
        position: relative;
        display: inline-block;
    }
</style>
