<script context="module">
export const prerendered = false;
</script>

<script lang="ts">
import { v4 as uuidv4 } from "uuid";

import { page } from "$app/stores";
import { nodeStore } from "./_store.ts";
import Map from "$lib/Map.svelte";

let newItemTitle = "";
let newItemParentId = "root";
let mainInput;

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

$: treeData = Object.values($nodeStore.nodes)
$: treeDataWithEditing = treeData.concat([{id: "editing", editing: true, text: newItemTitle, parentId: newItemParentId}])

function getParents(node, curr = []) {
  if (node.parentId === null) {
    return curr
  }
  const parent = $nodeStore.nodes[node.parentId];
  return getParents(parent, [parent, ...curr])
}
let parentOptions = [];
$: {
  const unsorted = treeData.map(node => {
    const path = getParents(node)
    path.push(node)
    return {
      depth: path.length,
      label: path.map(n => n.text).join("/"),
      id: node.id
    }
  })
  unsorted.sort((a, b) => {
    /*
    if (a.depth !== b.depth) {
      return a.depth - b.depth;
    }
    */
    return a.label.localeCompare(b.label)
  })
  parentOptions = unsorted;
}

function onEnter(event) {
  if (!newItemTitle) {
    return;
  }
  const text = newItemTitle;
  const parentId = newItemParentId;
  const id = uuidv4();
  const node: Node = {
    id,
    parentId,
    text,
  }

  $nodeStore.nodes[id] = node;
  newItemTitle = "";
  if (event.shiftKey) {
    newItemParentId = id;
  }
}

function onKeyup(event) {
  switch (event.key)  {
    case "Enter": return onEnter(event)
  }
}

function onSetEditingParent(event) {
  newItemParentId = event.detail.parentId;
  mainInput.focus();
}
</script>

<svelte:head>
	<title>Mind Mapping in {$page.params.room}</title>
</svelte:head>

<div>
  <div class="w-full bg-black flex justify-center items-center py-1">
    <div class="">
      <div class="pb-1">
        <select bind:value={newItemParentId}>
          {#each parentOptions as opt}
            <option value={opt.id}>
              {opt.label}
            </option>
          {/each}
        </select>
      </div>
      <div>
        <input
          bind:this={mainInput}
          bind:value={newItemTitle}
          id="newItemTitle"
          name="newItemTitle"
          class="border border-black p-2 w-96 rounded"
          on:keyup={onKeyup}
        />
      </div>
      <div class="text-xs text-white">
        <pre class="inline">enter</pre> to create
      </div>
      <div class="text-xs text-white">
        <pre class="inline">shift+enter</pre> to create and enter sub-tree
      </div>
    </div>
  </div>

  <div class="w-full">
    <Map treeData={treeDataWithEditing} on:setEditingParent={onSetEditingParent}/>
  </div>
</div>

<style>
</style>
