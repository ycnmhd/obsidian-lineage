import { LineageDocument, NodeId } from 'src/stores/document/document-state-type';

export type CardPosition = {
    nodeId: NodeId;
    x: number;
    y: number;
    depth: number;
};

export type MindmapLayout = {
    positions: Map<NodeId, CardPosition>;
    connections: { from: NodeId; to: NodeId }[];
};

/**
 * Calculates the positions for cards in a mindmap layout.
 * Uses a radial tree layout where the root is centered and children spread out.
 */
export function calculateMindmapPositions(
    document: LineageDocument,
    containerWidth: number,
    containerHeight: number,
    cardWidth: number,
    cardHeight: number,
): MindmapLayout {
    const positions = new Map<NodeId, CardPosition>();
    const connections: { from: NodeId; to: NodeId }[] = [];

    if (document.columns.length === 0) {
        return { positions, connections };
    }

    const rootColumn = document.columns[0];

    // Calculate the center of the container
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    // Build a tree structure from the document
    const nodeChildren = new Map<NodeId, NodeId[]>();
    const nodeParent = new Map<NodeId, NodeId | null>();
    const allNodes = new Set<NodeId>();

    // Initialize from root column (level 0 nodes)
    const rootNodes: NodeId[] = [];
    for (const group of rootColumn.groups) {
        for (const node of group.nodes) {
            allNodes.add(node);
            nodeChildren.set(node, []);
            nodeParent.set(node, null);
            rootNodes.push(node);
        }
    }

    // Process subsequent columns (children)
    for (let colIdx = 1; colIdx < document.columns.length; colIdx++) {
        const col = document.columns[colIdx];
        const prevCol = document.columns[colIdx - 1];

        for (const group of col.groups) {
            const parentId = group.parentId;
            for (const node of group.nodes) {
                allNodes.add(node);
                nodeChildren.set(node, []);
                nodeParent.set(node, parentId);

                if (nodeChildren.has(parentId)) {
                    nodeChildren.get(parentId)!.push(node);
                }

                // Add connection
                connections.push({ from: parentId, to: node });
            }
        }
    }

    // If there's only one root node, use radial layout
    if (rootNodes.length === 1) {
        return calculateRadialLayout(
            rootNodes[0],
            nodeChildren,
            positions,
            centerX,
            centerY,
            cardWidth,
            cardHeight,
        );
    }

    // Multiple root nodes: place them in a horizontal row
    const rootSpacing = cardWidth + 60;
    const totalRootWidth = rootNodes.length * rootSpacing;
    const startX = centerX - totalRootWidth / 2 + rootSpacing / 2;

    rootNodes.forEach((node, index) => {
        const x = startX + index * rootSpacing;
        positions.set(node, {
            nodeId: node,
            x: x - cardWidth / 2,
            y: centerY - cardHeight / 2,
            depth: 0,
        });

        // Recursively position children
        positionChildren(
            node,
            nodeChildren,
            positions,
            x,
            centerY,
            1,
            cardWidth,
            cardHeight,
        );
    });

    return { positions, connections };
}

/**
 * Calculates radial layout positions for a single root node.
 */
function calculateRadialLayout(
    rootNode: NodeId,
    nodeChildren: Map<NodeId, NodeId[]>,
    positions: Map<NodeId, CardPosition>,
    centerX: number,
    centerY: number,
    cardWidth: number,
    cardHeight: number,
): MindmapLayout {
    const connections: { from: NodeId; to: NodeId }[] = [];

    // Place root at center
    positions.set(rootNode, {
        nodeId: rootNode,
        x: centerX - cardWidth / 2,
        y: centerY - cardHeight / 2,
        depth: 0,
    });

    // Calculate angles for children
    const children = nodeChildren.get(rootNode) || [];
    const level1Radius = Math.max(200, cardWidth + 100);

    children.forEach((child, index) => {
        const angle = (2 * Math.PI * index) / children.length - Math.PI / 2;
        const x = centerX + level1Radius * Math.cos(angle) - cardWidth / 2;
        const y = centerY + level1Radius * Math.sin(angle) - cardHeight / 2;

        positions.set(child, {
            nodeId: child,
            x,
            y,
            depth: 1,
        });
        connections.push({ from: rootNode, to: child });

        // Position deeper levels
        positionDeepChildren(
            child,
            nodeChildren,
            positions,
            centerX + level1Radius * Math.cos(angle),
            centerY + level1Radius * Math.sin(angle),
            angle,
            2,
            cardWidth,
            cardHeight,
            connections,
        );
    });

    return { positions, connections };
}

/**
 * Recursively positions children for deep levels.
 */
function positionDeepChildren(
    parentNode: NodeId,
    nodeChildren: Map<NodeId, NodeId[]>,
    positions: Map<NodeId, CardPosition>,
    parentX: number,
    parentY: number,
    parentAngle: number,
    depth: number,
    cardWidth: number,
    cardHeight: number,
    connections: { from: NodeId; to: NodeId }[],
): void {
    const children = nodeChildren.get(parentNode) || [];
    if (children.length === 0) return;

    const radius = Math.max(150, cardWidth + 80);

    // Calculate spread angle based on number of children
    const spreadAngle = Math.PI / 3; // 60 degrees spread
    const startAngle = parentAngle - spreadAngle / 2;
    const angleStep =
        children.length > 1 ? spreadAngle / (children.length - 1) : 0;

    children.forEach((child, index) => {
        const angle = children.length === 1 ? parentAngle : startAngle + index * angleStep;
        const x = parentX + radius * Math.cos(angle) - cardWidth / 2;
        const y = parentY + radius * Math.sin(angle) - cardHeight / 2;

        positions.set(child, {
            nodeId: child,
            x,
            y,
            depth,
        });
        connections.push({ from: parentNode, to: child });

        // Recurse for deeper levels
        positionDeepChildren(
            child,
            nodeChildren,
            positions,
            parentX + radius * Math.cos(angle),
            parentY + radius * Math.sin(angle),
            angle,
            depth + 1,
            cardWidth,
            cardHeight,
            connections,
        );
    });
}

/**
 * Positions children in a hierarchical layout (for multiple roots).
 */
function positionChildren(
    parentNode: NodeId,
    nodeChildren: Map<NodeId, NodeId[]>,
    positions: Map<NodeId, CardPosition>,
    parentX: number,
    parentY: number,
    depth: number,
    cardWidth: number,
    cardHeight: number,
): void {
    const children = nodeChildren.get(parentNode) || [];
    if (children.length === 0) return;

    const verticalSpacing = cardHeight + 40;
    const horizontalOffset = cardWidth + 80;
    const totalHeight = children.length * verticalSpacing;
    const startY = parentY - totalHeight / 2 + verticalSpacing / 2;

    children.forEach((child, index) => {
        const x = parentX + horizontalOffset;
        const y = startY + index * verticalSpacing - cardHeight / 2;

        positions.set(child, {
            nodeId: child,
            x: x - cardWidth / 2,
            y,
            depth,
        });

        // Recurse for deeper levels
        positionChildren(
            child,
            nodeChildren,
            positions,
            x,
            y + cardHeight / 2,
            depth + 1,
            cardWidth,
            cardHeight,
        );
    });
}
