// src/db/database.web.ts
// Stub database untuk platform web — expo-sqlite tidak didukung di web.
// Metro otomatis memilih file .web.ts untuk bundel web.

import type { DatabaseLike } from "./database";

const stub: DatabaseLike = {
  getFirstAsync: async () => null,
  getAllAsync: async () => [],
  runAsync: async () => ({ changes: 0 }),
  execAsync: async () => {},
};

export async function ambilDatabase(): Promise<DatabaseLike> {
  return stub;
}

export const bukaDatabase = ambilDatabase;
