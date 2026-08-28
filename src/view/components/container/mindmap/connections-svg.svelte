<script lang="ts">
    import { NodeId } from 'src/stores/document/document-state-type';
    import { onDestroy, onMount } from 'svelte';

    export let positions: Map<NodeId, { x: number; y: number }>;
    export let connections: { from: NodeId; to: NodeId }[];
    export let containerRef: HTMLElement | null;
    export let activeNode: string;
    export let parentNodes: Set<string>;
    export let childGroups: Set<string>;
    export let zoom: number;

    let svgRef: SVGSVGElement | null = null;
    let paths: { from: string; to: string; element: SVGPathElement }[] = [];

    function getConnectionPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const cx1 = from.x + dx * 0.5;
        const cy1 = from.y;
        const cx2 = to.x - dx * 0.5;
        const cy2 = to.y;
        return `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;
    }

    function updatePaths() {
        if (!containerRef || !svgRef) return;

        const rect = containerRef.getBoundingClientRect();
        svgRef.setAttribute('width', rect.width.toString());
        svgRef.setAttribute('height', rect.height.toString());

        paths = [];
        for (const conn of connections) {
            const fromPos = positions.get(conn.from);
            const toPos = positions.get(conn.to);
            if (!fromPos || !toPos) continue;

            // Calculate center points for connection
            const fromCenter = {
                x: fromPos.x + 200 / zoom, // approximate card width / 2
                y: fromPos.y + 50 / zoom, // approximate card height / 2
            };
            const toCenter = {
                x: toPos.x + 200 / zoom,
                y: toPos.y + 50 / zoom,
            };

            const pathD = getConnectionPath(fromCenter, toCenter);

            const isActivePath = parentNodes.has(conn.to) || childGroups.has(conn.from);
            const isParentPath = parentNodes.has(conn.from);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathD);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', isActivePath
                ? 'var(--background-active-node)'
                : isParentPath
                    ? 'var(--background-active-parent)'
                    : 'var(--background-modifier-border)'
            );
            path.setAttribute('stroke-width', isActivePath ? '3' : '2');
            path.setAttribute('stroke-opacity', isActivePath ? '1' : '0.5');
            path.classList.add('mindmap-connection');
            if (isActivePath) path.classList.add('mindmap-connection-active');

            svgRef.appendChild(path);
            paths.push({ from: conn.from, to: conn.to, element: path });
        }
    }

    $: if (positions || connections || activeNode || parentNodes || childGroups || zoom) {
        // Clear existing paths
        if (svgRef) {
            while (svgRef.firstChild) {
                svgRef.removeChild(svgRef.firstChild);
            }
        }
        updatePaths();
    }

    onMount(() => {
        updatePaths();
        window.addEventListener('resize', updatePaths);
    });

    onDestroy(() => {
        window.removeEventListener('resize', updatePaths);
    });
</script>

<svg
    bind:this={svgRef}
    class="mindmap-connections"
    xmlns="http://www.w3.org/2000/svg"
></svg>

<style>
    :global(.mindmap-connections) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    }

    :global(.mindmap-connection) {
        transition: stroke 0.2s ease, stroke-opacity 0.2s ease;
    }

    :global(.mindmap-connection-active) {
        filter: drop-shadow(0 0 2px var(--background-active-node));
    }
</style>
