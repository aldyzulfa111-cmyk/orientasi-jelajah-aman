// src/db/database.ts
import * as SQLite from "expo-sqlite";

const VERSI_DATABASE = 2;

/** Interface minimal yang mencakup semua method SQLite yang dipakai di proyek ini */
export interface DatabaseLike {
  getFirstAsync<T>(sql: string, params?: unknown[]): Promise<T | null>;
  getAllAsync<T>(sql: string, params?: unknown[]): Promise<T[]>;
  runAsync(sql: string, params?: unknown[]): Promise<{ changes: number }>;
  execAsync(sql: string): Promise<void>;
}

let _dbInstance: DatabaseLike | null = null;

export async function ambilDatabase(): Promise<DatabaseLike> {
  if (_dbInstance) return _dbInstance;

  const db = await SQLite.openDatabaseAsync("jelajah_aman.db");
  await migrasiDatabase(db as unknown as DatabaseLike);
  _dbInstance = db as unknown as DatabaseLike;
  return _dbInstance;
}

export const bukaDatabase = ambilDatabase;

async function migrasiDatabase(db: DatabaseLike) {
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let versiSaatIni = result?.user_version ?? 0;

  if (versiSaatIni < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS cache_cuaca (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        nama_kota TEXT NOT NULL,
        data_json TEXT NOT NULL,
        disimpan_pada INTEGER NOT NULL,
        UNIQUE(latitude, longitude)
      );
    `);
    versiSaatIni = 1;
  }

  // Migrasi versi 2 sesuai modul praktikum
  if (versiSaatIni < 2) {
    await db.execAsync(
      "ALTER TABLE cache_cuaca ADD COLUMN jumlah_dibuka INTEGER NOT NULL DEFAULT 0;"
    );
    versiSaatIni = 2;
  }

  await db.execAsync(`PRAGMA user_version = ${VERSI_DATABASE}`);
}
