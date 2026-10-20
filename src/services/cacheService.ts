// src/services/cacheService.ts
import { ambilDatabase } from "../db/database";
import { DataCuacaLengkap, DataKualitasUdara } from "../types/weather";
import { DataTersimpan, RingkasanKotaTersimpan, SumberData } from "../types/cache";

const USIA_SEGAR_MS = 30 * 60 * 1000; // 30 menit

export function buatKunciCache(lat: number, lon: number): string {
  return `${lat.toFixed(4)}_${lon.toFixed(4)}`;
}

export async function ambilCache(
  kunci: string
): Promise<{ data: DataTersimpan | null; sumber: SumberData | null }> {
  // Parse lat/lon dari kunci format "lat_lon"
  const parts = kunci.split("_");
  if (parts.length < 2) return { data: null, sumber: null };
  const lat = parseFloat(parts[0]);
  const lon = parseFloat(parts[1]);
  if (isNaN(lat) || isNaN(lon)) return { data: null, sumber: null };

  const db = await ambilDatabase();
  const baris = await db.getFirstAsync<{
    id: number;
    data_json: string;
    disimpan_pada: number;
  }>(
    "SELECT id, data_json, disimpan_pada FROM cache_cuaca WHERE ROUND(latitude, 4) = ? AND ROUND(longitude, 4) = ?",
    [lat, lon]
  );

  if (!baris) return { data: null, sumber: null };

  const sekarang = Date.now();
  const usia = sekarang - baris.disimpan_pada;
  const sudahBasi = usia > USIA_SEGAR_MS;

  const parsed = JSON.parse(baris.data_json);
  const data: DataTersimpan = {
    cuaca: parsed.cuaca,
    kualitasUdara: parsed.kualitasUdara,
    disimpanPada: baris.disimpan_pada,
  };

  return {
    data,
    sumber: sudahBasi ? "cache-basi" : "cache-segar",
  };
}

export async function simpanCache(
  kunci: string,
  kotaId: number,
  namaKota: string,
  lat: number,
  lon: number,
  cuaca: DataCuacaLengkap,
  aqi: DataKualitasUdara
): Promise<void> {
  const db = await ambilDatabase();
  const sekarang = Date.now();
  const latRounded = parseFloat(lat.toFixed(4));
  const lonRounded = parseFloat(lon.toFixed(4));
  const dataJson = JSON.stringify({ cuaca, kualitasUdara: aqi });

  await db.runAsync(
    `INSERT INTO cache_cuaca (latitude, longitude, nama_kota, data_json, disimpan_pada, jumlah_dibuka)
     VALUES (?, ?, ?, ?, ?, 1)
     ON CONFLICT(latitude, longitude) DO UPDATE SET
       nama_kota = excluded.nama_kota,
       data_json = excluded.data_json,
       disimpan_pada = excluded.disimpan_pada,
       jumlah_dibuka = jumlah_dibuka + 1;`,
    [latRounded, lonRounded, namaKota, dataJson, sekarang]
  );
}

export async function ambilSemuaCacheTersimpan(): Promise<RingkasanKotaTersimpan[]> {
  const db = await ambilDatabase();
  const hasil = await db.getAllAsync<{
    id: number;
    nama_kota: string;
    latitude: number;
    longitude: number;
    disimpan_pada: number;
  }>(
    "SELECT id, nama_kota, latitude, longitude, disimpan_pada FROM cache_cuaca ORDER BY disimpan_pada DESC"
  );

  return hasil.map((r) => ({
    kunci: `${r.latitude.toFixed(4)}_${r.longitude.toFixed(4)}`,
    id: r.id,
    nama: r.nama_kota,
    latitude: r.latitude,
    longitude: r.longitude,
    disimpanPada: r.disimpan_pada,
  }));
}

