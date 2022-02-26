<script context="module">
export const prerendered = false;
</script>

<script lang="ts">
import { v4 as uuidv4 } from "uuid";

import { page } from "$app/stores";
import { nodeStore } from "./_store.ts";
import Map from "$lib/Map.svelte";
import Tree from "$lib/Tree.svelte";

let newItemTitle = "";

$: treeData = Object.values($nodeStore.nodes)

$: treeJSON = JSON.stringify($nodeStore.nodes)

let treeOptions = {
  title: "Tree",
  height: "2000px",
  tree: {
    rootTitle: $page.params.room
  }
}

type Node = {
  id: string,
  text: string,
  parentId: string | null, // null means top level
}

if (!$nodeStore.nodes["root"]) {
  $nodeStore.nodes["root"] = {
    id: "root",
    text: $page.params.room,
    parentId: null,
  }
}

function onEnter(event) {
  let parentId = "root"
  let text = newItemTitle
  if (text[0] === "#") {
    const splitText = text.split(" ")
    parentId = splitText.shift().substring(1)
    text = splitText.join(" ")
  }
  const id = uuidv4();
  const node: Node = {
    id,
    parentId,
    text,
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
  {treeJSON}
  </div>
  <div>
    <Tree data={treeData} width={1000} padding={10}/>
  </div>

</div>

<style>
</style>
