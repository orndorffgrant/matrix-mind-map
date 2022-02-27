<script lang="ts">
import { onMount } from 'svelte';
import Tree from "$lib/Tree.svelte";

export let treeData;

let container;
let width = 500;
let height = 200;

onMount(resize);

function resize() {
    ({ width, height } = container.getBoundingClientRect());
}

</script>

<svelte:window on:resize='{resize}'/>

<div bind:this={container} class="w-full">
    <Tree data={treeData} width={width} padding={10} on:setEditingParent />
</div>

<style>
</style>
