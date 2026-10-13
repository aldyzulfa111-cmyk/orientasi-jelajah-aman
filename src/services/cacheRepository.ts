// src/services/cacheRepository.ts
import { ambilDatabase } from "../db/database";
import { DataCuacaLengkap, DataKualitasUdara } from "../types/weather";
import { KotaUntukCache } from "../types/cache";

export async function ambilCache(latitude: number, longitude: number) {
  if (
    latitude === undefined ||
    longitude === undefined ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    return null;
  }

  const db = await ambilDatabase();
  const lat = parseFloat(latitude.toFixed(4));
  const lon = parseFloat(longitude.toFixed(4));

  const result = await db.getFirstAsync<{
    id: number;
    latitude: number;
    longitude: number;
    nama_kota: string;
    data_json: string;
    disimpan_pada: number;
    jumlah_dibuka: number;
  }>(
    "SELECT * FROM cache_cuaca WHERE ROUND(latitude, 4) = ? AND ROUND(longitude, 4) = ?;",
    [lat, lon],
  );

  if (!result) return null;

  // Increment jumlah_dibuka setiap kali cache dibuka
  await db.runAsync(
    "UPDATE cache_cuaca SET jumlah_dibuka = jumlah_dibuka + 1 WHERE id = ?;",
    [result.id],
  );

  const parsed = JSON.parse(result.data_json);
  return {
    cuaca: parsed.cuaca,
    kualitasUdara: parsed.kualitasUdara,
    disimpanPada: result.disimpan_pada,
    jumlahDibuka: result.jumlah_dibuka + 1,
  };
}

export async function simpanCache(
  kota: KotaUntukCache,
  cuaca: DataCuacaLengkap,
  kualitasUdara: DataKualitasUdara,
) {
  const db = await ambilDatabase();

  // Amankan nilai agar tidak ada yang undefined
  const lat =
    typeof kota.latitude === "number"
      ? parseFloat(kota.latitude.toFixed(4))
      : 0;
  const lon =
    typeof kota.longitude === "number"
      ? parseFloat(kota.longitude.toFixed(4))
      : 0;
  const namaKota = kota.nama ?? "Lokasi";
  const dataJson = JSON.stringify({ cuaca, kualitasUdara });
  const disimpanPada = Date.now();

  await db.runAsync(
    `INSERT INTO cache_cuaca (latitude, longitude, nama_kota, data_json, disimpan_pada, jumlah_dibuka)
     VALUES (?, ?, ?, ?, ?, 1)
     ON CONFLICT(latitude, longitude) DO UPDATE SET
       nama_kota = excluded.nama_kota,
       data_json = excluded.data_json,
       disimpan_pada = excluded.disimpan_pada,
       jumlah_dibuka = jumlah_dibuka + 1;`,
    [lat, lon, namaKota, dataJson, disimpanPada],
  );
}

export async function bersihkanCacheLama(batasMs: number) {
  const db = await ambilDatabase();
  const batasWaktu = Date.now() - batasMs;
  await db.runAsync("DELETE FROM cache_cuaca WHERE disimpan_pada < ?;", [
    batasWaktu,
  ]);
}

export async function daftarKotaTersimpan() {
  const db = await ambilDatabase();
  const rows = await db.getAllAsync<{
    id: number;
    latitude: number;
    longitude: number;
    nama_kota: string;
    disimpan_pada: number;
    jumlah_dibuka: number;
  }>(
    "SELECT id, latitude, longitude, nama_kota, disimpan_pada, jumlah_dibuka FROM cache_cuaca ORDER BY disimpan_pada DESC;",
  );

  return rows.map((r) => ({
    kunci: `${r.latitude},${r.longitude}`,
    id: r.id,
    nama: r.nama_kota,
    latitude: r.latitude,
    longitude: r.longitude,
    disimpanPada: r.disimpan_pada,
    jumlahDibuka: r.jumlah_dibuka,
  }));
}

export async function hapusSemuaCache() {
  try {
    const db = await ambilDatabase();
    await db.execAsync("DELETE FROM cache_cuaca;");
  } catch (error) {
    console.error("Gagal menghapus semua cache:", error);
  }
}
