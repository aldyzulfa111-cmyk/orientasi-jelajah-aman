// src/app/tambah-favorit.tsx
import { View, Text, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { tambahFavorit } from "../services/favoritStorage";

export default function ModalTambahFavorit() {
  const params = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  // Amankan dari undefined dan string[]
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const nama = Array.isArray(params.nama) ? params.nama[0] : params.nama;
  const lat = Array.isArray(params.lat) ? params.lat[0] : params.lat;
  const lon = Array.isArray(params.lon) ? params.lon[0] : params.lon;

  async function simpan() {
    if (!nama || !lat || !lon) {
      router.back();
      return;
    }
    await tambahFavorit({
      id: Number(id) || 0,
      nama: nama ?? "Lokasi",
      latitude: Number(lat) || 0,
      longitude: Number(lon) || 0,
    });
    router.back();
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text>Tambahkan {nama ?? "lokasi ini"} ke daftar favorit?</Text>
      <Button title="Simpan" onPress={simpan} />
    </View>
  );
}