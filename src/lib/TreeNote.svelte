<script lang="ts">
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

export let text;
export let leaf;
export let editing;

function deleteSelf() {
    dispatch("delete")
}

function setParent() {
    dispatch("setParent")
}

</script>

<div class="w-full h-full relative">
    <div class="pl-2 pr-8">
        {text}
    </div>
    {#if false}
        <div class="absolute top-0 right-0">
            <button
                class="cursor-pointer hover:bg-red-700 hover:text-white px-1 rounded"
                on:click={deleteSelf}
            >
                X
            </button>
        </div>
    {/if}
    {#if !editing}
        <div class="absolute bottom-0 right-0">
            <button
                class="cursor-pointer bg-black text-white hover:bg-blue-700 px-1 rounded"
                on:click={setParent}
            >
                ➜
            </button>
        </div>
    {/if}
</div>

<style>
</style>
