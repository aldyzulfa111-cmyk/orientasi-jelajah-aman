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
  const db = await ambilDatabase();
  const baris = await db.getFirstAsync<{
    cuaca_json: string;
    aqi_json: string;
    disimpan_pada: number;
  }>("SELECT cuaca_json, aqi_json, disimpan_pada FROM cache_cuaca WHERE kunci = ?", [kunci]);

  if (!baris) return { data: null, sumber: null };

  const sekarang = Date.now();
  const usia = sekarang - baris.disimpan_pada;
  const sudahBasi = usia > USIA_SEGAR_MS;

  const data: DataTersimpan = {
    cuaca: JSON.parse(baris.cuaca_json),
    kualitasUdara: JSON.parse(baris.aqi_json),
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
  await db.runAsync(
    `INSERT OR REPLACE INTO cache_cuaca 
     (kunci, kota_id, nama_kota, latitude, longitude, cuaca_json, aqi_json, disimpan_pada) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      kunci,
      kotaId,
      namaKota,
      lat,
      lon,
      JSON.stringify(cuaca),
      JSON.stringify(aqi),
      sekarang,
    ]
  );
}

export async function ambilSemuaCacheTersimpan(): Promise<RingkasanKotaTersimpan[]> {
  const db = await ambilDatabase();
  const hasil = await db.getAllAsync<{
    kunci: string;
    kota_id: number;
    nama_kota: string;
    latitude: number;
    longitude: number;
    disimpan_pada: number;
  }>("SELECT kunci, kota_id, nama_kota, latitude, longitude, disimpan_pada FROM cache_cuaca ORDER BY disimpan_pada DESC");

  return hasil.map((r) => ({
    kunci: r.kunci,
    id: r.kota_id,
    nama: r.nama_kota,
    latitude: r.latitude,
    longitude: r.longitude,
    disimpanPada: r.disimpan_pada,
  }));
}
