<script lang="ts">
import { onMount } from 'svelte';

export let nodes;

let container;
let width = 500;
let height = 200;

onMount(resize);

function resize() {
    ({ width, height } = container.getBoundingClientRect());
}

</script>

<svelte:window on:resize='{resize}'/>

<div>

</div>

<style>
</style>
