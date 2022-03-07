<script lang="ts">
// This started as a svelte port of https://observablehq.com/@d3/tree which is:
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
import TreeNote from "$lib/TreeNote.svelte";

import * as d3 from 'd3';

type TreeNode = {
    id: string,
    text: string,
    parentId: string | null,
}

export let data: TreeNode;
export let width: number;

$: root = d3.stratify()(data)

const noteBox = {
    width: 150,
    height: 60,
}
const verticalSpace = noteBox.height + 12;
const horizontalSpace = noteBox.width + 100;
$: tree = d3.tree().nodeSize([verticalSpace, horizontalSpace])(root);

$: links = tree.links()
$: linkPaths = links.map(link => d3.linkHorizontal().x(coord => coord.y).y(coord => coord.x).source(d => ({ x: d.source.x, y: d.source.y + noteBox.width }))(link))

$: nodes = tree.descendants()

let viewBox;
$: {
    const heights = nodes.reduce((currHeights, n) => {
        if (n.x > currHeights.highest) {
            currHeights.highest = n.x;
        }
        if (n.x < currHeights.lowest) {
            currHeights.lowest = n.x;
        }
        return currHeights;
    }, { highest: -Infinity, lowest: Infinity });

    const height = heights.highest - heights.lowest + verticalSpace * 2;
    viewBox = {
        minX: -horizontalSpace,
        minY: heights.lowest - verticalSpace,
        width,
        height,
    }
}
$: viewBoxStr = viewBox ? `${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}` : ''

function setEditingParent(parentId) {
    dispatch('setEditingParent', {
        parentId,
    });
}
function deleteNode(id) {
    dispatch('deleteNode', {
        id,
    });
}
</script>

<div class="relative">
    <svg
        class="absolute top-0 left-0"
        width={viewBox.width}
        height={viewBox.height}
        viewBox={viewBoxStr}
        font-family="sans-serif"
        font-size=14
    >
        <!-- connecting lines -->
        <g
        fill="none"
        stroke="#909090"
        stroke-width="1"
        >
            {#each linkPaths as linkPath}
                <path
                    d={linkPath}
                />
            {/each}
        </g>

        <!-- nodes -->
        <g>
            {#each nodes as node}
                <g>
                    <rect
                        x={node.y}
                        y={node.x - (noteBox.height / 2)}
                        width={noteBox.width}
                        height={noteBox.height}
                        stroke={node.data.editing ? "cyan" : "#404040"}
                        stroke-width=2
                        rx=5
                        fill="transparent"
                        class="cursor-pointer"
                    />
                </g>
            {/each}
        </g>
    </svg>
    <div
        class="absolute top-0 left-0"
    >
        {#each nodes as node}
            <div
                class="absolute pr-2 py-1"
                style:left={`${node.y - viewBox.minX}px`}
                style:top={`${node.x - (noteBox.height / 2) - viewBox.minY}px`}
                style:width={`${noteBox.width}px`}
                style:height={`${noteBox.height}px`}
                >
                <TreeNote
                    text={node.data.text}
                    leaf={!node.children}
                    editing={node.data.editing}
                    on:setParent={() => setEditingParent(node.id)}
                    on:delete={() => deleteNode(node.id)}
                />
            </div>
        {/each}
    </div>
</div>


<style>
svg {
    max-width: 100%;
    height: auto;
    height: intrinsic;
}
</style>
