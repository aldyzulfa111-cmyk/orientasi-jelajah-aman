import { useState, useCallback } from "react";
import { View, Text, Button, Alert, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { daftarKotaTersimpan, hapusCache } from "../../services/cacheRepository";
import { useTheme } from "../../context/ThemeContext";

export default function TabRiwayat() {
  const [daftarRiwayat, setDaftarRiwayat] = useState<any[]>([]);
  const router = useRouter();
  const { isDarkMode } = useTheme();

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
    router.navigate({
      pathname: "/",
      params: { lat: kota.latitude, lon: kota.longitude, nama: kota.nama },
    });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 12,
        backgroundColor: isDarkMode ? "#121212" : "#ffffff",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: isDarkMode ? "#ffffff" : "#000000",
        }}
      >
        Riwayat Pencarian & Cache
      </Text>
      <Text style={{ color: isDarkMode ? "#aaaaaa" : "#666666" }}>
        Tersimpan {daftarRiwayat.length} lokasi (Maks 10 terakhir)
      </Text>

      {daftarRiwayat.length === 0 && (
        <Text
          style={{
            fontStyle: "italic",
            color: isDarkMode ? "#777777" : "#888888",
            marginTop: 20,
          }}
        >
          Belum ada riwayat pencarian. Cari kota di beranda untuk menyimpan cache offline!
        </Text>
      )}

      <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 96 }}>
        {daftarRiwayat.map((kota) => (
          <View
            key={kota.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 12,
              backgroundColor: isDarkMode ? "#1e1e1e" : "#f9f9f9",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDarkMode ? "#333333" : "#eee",
            }}
          >
            <TouchableOpacity onPress={() => pilihKota(kota)} style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: isDarkMode ? "#4da6ff" : "#007AFF",
                }}
              >
                {kota.nama}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: isDarkMode ? "#aaaaaa" : "#555555",
                }}
              >
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