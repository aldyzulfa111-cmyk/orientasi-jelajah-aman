// components/WeatherCard.tsx
import { View, Text } from "react-native";
import { WeatherCardProps } from "../types/cuaca";

// 1. Tambahkan import ini untuk memanggil variabel dari constants/styles.ts
import { typeScale, spacing } from "../constants/styles";

export default function WeatherCard({ kota, suhu, tingkatAQI }: WeatherCardProps) {
  const warnaAQI = tingkatAQI === "BAIK" ? "green" : "orange";

  return (
    <View style={{ 
      // 2. Ganti angka padding menjadi spacing.sedang
      padding: spacing.sedang, 
      borderRadius: 8, 
      backgroundColor: "#F4F7FA" 
    }}>
      {/* 3. Ganti fontSize judul menjadi typeScale.judul */}
      <Text style={{ fontWeight: "bold", fontSize: typeScale.judul }}>{kota}</Text>
      
      <Text style={{ fontSize: 32 }}>{suhu}°C</Text>
      
      {/* 4. Ganti fontSize isi menjadi typeScale.isi */}
      <Text style={{ color: warnaAQI, fontSize: typeScale.isi }}>
        AQI: {tingkatAQI}
      </Text>
    </View>
  );
}