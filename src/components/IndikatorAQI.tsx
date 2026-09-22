// components/IndikatorAQI.tsx
import { View, Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";

export default function IndikatorAQI({ kota, indeksAQI, tingkat, diperbaruiPada }: LaporanUdara) {
  const warnaStatus = {
    BAIK: "green",
    SEDANG: "#D97706", // kuning tua / oranye muda
    TIDAK_SEHAT: "orange",
    BERBAHAYA: "red",
  }[tingkat];

  return (
    <View style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#DDD", gap: 4 }}>
      <Text style={{ fontWeight: "bold" }}>Laporan Udara: {kota}</Text>
      <Text>Indeks AQI: {indeksAQI}</Text>
      <Text style={{ color: warnaStatus, fontWeight: "bold" }}>
        Status: {tingkat}
      </Text>
      {diperbaruiPada && (
        <Text style={{ fontSize: 12, color: "#666" }}>
          Diperbarui pada: {diperbaruiPada}
        </Text>
      )}
    </View>
  );
}