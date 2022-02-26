<script lang="ts">
// This is a svelte port of https://observablehq.com/@d3/tree
// Which is:
// Copyright 2021 Observable, Inc.
// Released under the ISC license.

import * as d3 from 'd3';

type TreeNode = {
    id: string,
    text: string,
    parentId: string | null,
}

export let data: TreeNode;
export let width: number;
export let padding: number;

const root = d3.stratify()(data)

const verticalSpace = 10;
const horizontalSpace = width / (root.height + padding);
d3.tree().nodeSize([verticalSpace, horizontalSpace])(root);

// Compute height.
let highestElementHeight = -Infinity;
let lowestElementHeight = Infinity;
root.each(n => {
    if (n.x > highestElementHeight) {
        highestElementHeight = n.x;
    }
    if (n.x < lowestElementHeight) {
        lowestElementHeight = n.x;
    }
});

const height = highestElementHeight - lowestElementHeight + verticalSpace * 2;
const viewBox = {
 minX: -horizontalSpace * padding / 2,
 minY: lowestElementHeight - verticalSpace,
 width,
 height,
}
const viewBoxStr = `${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`
const horizonalLinker = d3.linkHorizontal().x(d => d.y).y(d => d.x);
</script>

<svg
    width={width}
    height={height}
    viewBox={viewBoxStr}
    font-family="sans-serif"
    font-size=10
>
    <!-- connecting lines -->
    <g
      fill="none"
      stroke="green"
      stroke-width="5"
    >
        {#each root.links() as link}
            <path
                d={d3.linkHorizontal().x(d => d.y).y(d => d.x)(link)}
            />
        {/each}
    </g>

    <!-- nodes -->
    <g>
        {#each root.descendants() as node}
            <a transform={`translate(${node.y}, ${node.x})`}>
                <circle fill="green" r=3 />
                <text
                    dy="0.32em"
                    x={node.children ? -6 : 6}
                    text-anchor={node.children ? "end" : "start"}
                    >
                    {node.data.text}
                </text>
            </a>
        {/each}
    </g>
</svg>


<style>
svg {
    max-width: 100%;
    height: auto;
    height: intrinsic;
}
</style>
