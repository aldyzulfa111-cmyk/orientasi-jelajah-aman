// src/services/weatherRepository.ts
import { ambilCuaca } from "./weatherService";
import { ambilKualitasUdara } from "./airQualityService";
import { buatKunciCache, ambilCache, simpanCache } from "./cacheService";
import { HasilCuacaOffline } from "../types/cache";

export async function ambilCuacaDenganCache(
  kotaId: number,
  namaKota: string,
  lat: number,
  lon: number,
  paksaSegar: boolean = false
): Promise<HasilCuacaOffline> {
  const kunci = buatKunciCache(lat, lon);

  if (!paksaSegar) {
    const hasilCache = await ambilCache(kunci);
    if (hasilCache.data && hasilCache.sumber === "cache-segar") {
      return {
        ...hasilCache.data,
        sumber: "cache-segar",
      };
    }
    if (hasilCache.data && hasilCache.sumber === "cache-basi") {
      // Coba ambil dari jaringan di latar belakang (background sync)
      ambilDariJaringanDanSimpan(kunci, kotaId, namaKota, lat, lon).catch(() => {});
      return {
        ...hasilCache.data,
        sumber: "cache-basi",
      };
    }
  }

  // Jika tidak ada cache atau dipaksa segar, ambil dari jaringan
  try {
    return await ambilDariJaringanDanSimpan(kunci, kotaId, namaKota, lat, lon);
  } catch (err) {
    // Fallback terakhir: jika jaringan gagal, gunakan cache basi jika ada
    const hasilCache = await ambilCache(kunci);
    if (hasilCache.data) {
      return {
        ...hasilCache.data,
        sumber: "cache-basi",
      };
    }
    throw err;
  }
}

async function ambilDariJaringanDanSimpan(
  kunci: string,
  kotaId: number,
  namaKota: string,
  lat: number,
  lon: number
): Promise<HasilCuacaOffline> {
  const [cuaca, kualitasUdara] = await Promise.all([
    ambilCuaca(lat, lon),
    ambilKualitasUdara(lat, lon),
  ]);

  await simpanCache(kunci, kotaId, namaKota, lat, lon, cuaca, kualitasUdara);

  return {
    cuaca,
    kualitasUdara,
    disimpanPada: Date.now(),
    sumber: "jaringan",
  };
}