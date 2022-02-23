import { syncedStore } from "@syncedstore/core";
import { svelteSyncedStore } from "@syncedstore/svelte";

export const _store = syncedStore({ nodes: {} });
export const nodeStore = svelteSyncedStore(_store);
