import { useState, useCallback } from "react";
import { View, Text, Button, Alert, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { daftarKotaTersimpan, hapusCache } from "../../services/cacheRepository";

export default function TabRiwayat() {
  const [daftarRiwayat, setDaftarRiwayat] = useState<any[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      muatRiwayat();
    }, [])
  );

  async function muatRiwayat() {
    const data = await daftarKotaTersimpan();
    setDaftarRiwayat(data);
  }

  async function eksekusiHapus(id: number) {
    await hapusCache(id);
    muatRiwayat();
  }

  function konfirmasiHapus(kota: any) {
    if (Platform.OS === "web") {
      const yakin = window.confirm(`Yakin hapus cache ${kota.nama}?`);
      if (yakin) {
        eksekusiHapus(kota.id);
      }
    } else {
      Alert.alert("Konfirmasi Hapus", `Yakin hapus cache ${kota.nama}?`, [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => eksekusiHapus(kota.id),
        },
      ]);
    }
  }

  function pilihKota(kota: any) {
    // Navigasi kembali ke beranda dengan membawa parameter koordinat kota
    router.push({
      pathname: "/",
      params: { lat: kota.latitude, lon: kota.longitude, nama: kota.nama },
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Riwayat Pencarian & Cache</Text>
      <Text style={{ color: "#666" }}>Tersimpan {daftarRiwayat.length} lokasi (Maks 10 terakhir)</Text>

      {daftarRiwayat.length === 0 && (
        <Text style={{ fontStyle: "italic", color: "#888", marginTop: 20 }}>
          Belum ada riwayat pencarian. Cari kota di beranda untuk menyimpan cache offline!
        </Text>
      )}

      <ScrollView contentContainerStyle={{ gap: 10 }}>
        {daftarRiwayat.map((kota) => (
          <View
            key={kota.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 12,
              backgroundColor: "#f9f9f9",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#eee",
            }}
          >
            <TouchableOpacity onPress={() => pilihKota(kota)} style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#007AFF" }}>
                {kota.nama}
              </Text>
              <Text style={{ fontSize: 12, color: "#555" }}>
                Dibuka: {kota.jumlahDibuka}x | Lat/Lon: {kota.latitude}, {kota.longitude}
              </Text>
            </TouchableOpacity>
            <Button title="Hapus" color="#ff3b30" onPress={() => konfirmasiHapus(kota)} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}