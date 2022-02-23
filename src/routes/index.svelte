<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
import { goto } from "$app/navigation";
let matrixId = "";
let password = "";
let roomId = "";
function handleButton() {
  console.info({
    matrixId,
    password,
    roomId,
  })
  if (roomId === "") {
    return;
  }
  goto(`/map/${roomId}`)
}
</script>

<svelte:head>
	<title>Matrix Mind Mapper</title>
</svelte:head>

<section>
	<h1 class="text-xl p-2">
    Matrix Mind Mapper
	</h1>
	<div class="p-4">
    <label>
      <div>
        Matrix ID
      </div>
      <div>
        @
        <input
          class="border border-black p-1"
          bind:value={matrixId}
          id="matrixId"
          name="matrixId"
          placeholder="username:homeserver.tld"
          />
      </div>
    </label>
	</div>
	<div class="p-4">
    <label>
      <div>
        Password
      </div>
      <input
        class="border border-black p-1"
        bind:value={password}
        id="password"
        name="password"
        type="password"
        />
    </label>
	</div>
	<div class="p-4">
    <label>
      <div>
        Room ID
      </div>
      <input
        class="border border-black p-1"
        bind:value={roomId}
        id="roomId"
        name="roomId"
        />
    </label>
	</div>
	<div class="p-2">
    <button
      class="bg-black text-white p-2 rounded cursor-pointer hover:bg-blue-900 active:bg-violet-700"
      on:click={handleButton}
      >
      Start Mapping
    </button>
	</div>
</section>

<style>
</style>
