<script context="module">
export const prerendered = false;
</script>

<script lang="ts">
import { v4 as uuidv4 } from "uuid";

import { page } from "$app/stores";
import { nodeStore } from "./_store.ts";
let newItemTitle = "";

$: treeData = Object.keys($nodeStore.nodes).map(id => {
  return {
    "name": $nodeStore.nodes[id].title
  }
})

let treeOptions = {
  title: "Tree",
  height: "2000px",
  tree: {
    rootTitle: $page.params.room
  }
}

type Node = {
  title: string,
  parentId: string | null, // null means top level
}

function onEnter(event) {
  const id = uuidv4();
  const node: Node = {
    title: newItemTitle,
  }

  $nodeStore.nodes[id] = node;
  newItemTitle = "";
}

function onKeyup(event) {
  switch (event.key)  {
    case "Enter": return onEnter(event)
  }
}
</script>

<svelte:head>
	<title>Mind Mapping in {$page.params.room}</title>
</svelte:head>

<div>
  <div class="w-full bg-black flex justify-center items-center py-1">
    <div class="flex items-center">
      <input
        bind:value={newItemTitle}
        id="newItemTitle"
        name="newItemTitle"
        class="border border-black p-2 w-96 rounded"
        on:keyup={onKeyup}
      />
      <span class="text-white pl-2">
        <pre class="inline">enter</pre> to create new node
      </span>
    </div>
  </div>

  <div>
  </div>

</div>

<style>
</style>
