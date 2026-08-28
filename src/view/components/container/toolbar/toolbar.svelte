<script>
    import NavigationHistory from './components/navigation-buttons.svelte';
    import SearchToggle from './components/search-toggle.svelte';
    import LeftSidebarToggle from './components/left-sidebar-toggle.svelte';
    import DocumentHistoryButtons from './components/document-history-buttons.svelte';
    import SearchBar from './components/search-bar.svelte';
</script>

<div class="navigation-history-container">
    <LeftSidebarToggle />
    <NavigationHistory />
    <DocumentHistoryButtons />
    <SearchToggle />
    <SearchBar />
</div>

<style>
    .navigation-history-container {
        z-index: var(--z-index-breadcrumbs);
        left: var(--size-4-2);
        top: var(--size-4-2);
        display: flex;
        position: absolute;
        gap: var(--size-4-2);
        flex-wrap: wrap;
        max-width: 90%;
    }
</style>
