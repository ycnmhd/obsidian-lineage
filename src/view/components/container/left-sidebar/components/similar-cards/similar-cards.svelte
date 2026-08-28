<script lang="ts">
    import { getView } from '../../../context';
    import { ActiveStatus } from '../../../column/components/group/components/active-status.enum';
    import Node from '../../../column/components/group/components/card/card.svelte';
    import { documentStateStore } from '../../../../../../stores/view/derived/editing-store';
    import { IdSectionStore } from '../../../../../../stores/document/derived/id-section-store';
    import { PendingConfirmationStore } from 'src/stores/view/derived/pending-confirmation';
    import { NodeStylesStore } from 'src/stores/view/derived/style-rules';
    import NoItems from '../no-items/no-items.svelte';
    import { lang } from 'src/lang/lang';
    import { derived } from 'src/lib/store/derived';

    const view = getView();
    const idSection = IdSectionStore(view);
    const editingStateStore = documentStateStore(view);
    const pendingConfirmation = PendingConfirmationStore(view);
    const styleRules = NodeStylesStore(view);

    const similarCardsState = derived(view.viewStore, (state) => state.similarCards);

    $: nodeIds = $similarCardsState.nodeIds;
    $: scores = $similarCardsState.scores;
    $: query = $similarCardsState.query;
    $: loading = $similarCardsState.loading;

    function getScoreLabel(nodeId: string): string {
        const score = scores.get(nodeId);
        if (score === undefined) return '';
        const pct = Math.round(score * 100);
        return lang.similar_cards_score_label(pct);
    }

    function getScoreOpacity(nodeId: string): number {
        const score = scores.get(nodeId);
        if (score === undefined) return 0.4;
        const pct = score * 100;
        if (pct > 80) return 1;
        if (pct > 50) return 0.7;
        return 0.4;
    }
</script>

<div class="similar-cards-wrapper">
    {#if query}
        <div class="query-info">
            <span class="query-label">{lang.similar_cards_query}</span>
            <span class="query-text" title={query}>{query}</span>
        </div>
    {/if}
    <div class="similar-cards-container">
        {#if loading}
            <div class="similar-cards-loading">
                <span class="loading-text">Searching...</span>
            </div>
        {:else if nodeIds.length > 0}
            {#each nodeIds as nodeId (nodeId)}
                <div class="similar-card-wrapper">
                    <Node
                        node={nodeId}
                        active={
                            $editingStateStore.activeNodeId === nodeId &&
                            $editingStateStore.isInSidebar === true
                                ? ActiveStatus.node
                                : ActiveStatus.sibling
                        }
                        editing={$editingStateStore.activeNodeId === nodeId &&
                            $editingStateStore.isInSidebar === true}
                        confirmDisableEdit={$editingStateStore.activeNodeId === nodeId &&
                            $pendingConfirmation.disableEdit === nodeId &&
                            $editingStateStore.isInSidebar === true}
                        confirmDelete={$pendingConfirmation.deleteNode.has(nodeId)}
                        isInSidebar={true}
                        firstColumn={true}
                        section={$idSection[nodeId]}
                        hasActiveChildren={false}
                        hasChildren={false}
                        selected={false}
                        pinned={false}
                        style={$styleRules.get(nodeId)}
                        outlineMode={false}
                        collapsed={false}
                        hidden={false}
                        alwaysShowCardButtons={true}
                    />
                    <div class="score-badge" style="opacity: {getScoreOpacity(nodeId)}">
                        {getScoreLabel(nodeId)}
                    </div>
                </div>
            {/each}
        {:else}
            <NoItems variant="similar" />
        {/if}
    </div>
</div>

<style>
    .similar-cards-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .query-info {
        padding: 0 10px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .query-label {
        font-size: var(--font-ui-smaller);
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .query-text {
        font-size: var(--font-ui-small);
        color: var(--text-normal);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .similar-cards-container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        flex: 1 1 auto;
        padding-bottom: 10px;
        overflow-y: auto;
    }

    .similar-card-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: relative;
    }

    .score-badge {
        font-size: var(--font-ui-smaller);
        color: var(--text-muted);
        padding: 2px 8px;
        text-align: right;
    }

    .similar-cards-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        width: 100%;
    }

    .loading-text {
        color: var(--text-muted);
        font-style: italic;
    }
</style>
