// app/(tabs)/index.tsx
import { View } from "react-native";
import { useState, useEffect } from "react";

// Karena berada di dalam folder (tabs), gunakan "../../" untuk mengakses folder components di luar
import WeatherCard from "../../components/WeatherCard";
import SearchBox from "../../components/SearchBox";
import RiwayatList from "../../components/RiwayatList";

export default function HalamanUtama() {
  const [kotaAktif, setKotaAktif] = useState("Pekalongan");
  const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan"]);

  // Tambahkan useEffect untuk mencatat perubahan kota aktif sesuai modul praktikum
  useEffect(() => {
    console.log("Kota aktif berubah menjadi:", kotaAktif);
  }, [kotaAktif]);

  function handleCari(kota: string) {
    if (!kota.trim()) return;
    setKotaAktif(kota);
    if (!riwayat.includes(kota)) {
      setRiwayat([...riwayat, kota]);
    }
  }

  return (
    <View style={{ padding: 16, gap: 16, paddingTop: 60 }}>
      <SearchBox onCari={handleCari} />
      <WeatherCard kota={kotaAktif} suhu={29} tingkatAQI="BAIK" />
      {/* Menggunakan prop daftarkota sesuai komponen RiwayatList.tsx */}
      <RiwayatList daftarKota={riwayat} />
    </View>
  );
}
