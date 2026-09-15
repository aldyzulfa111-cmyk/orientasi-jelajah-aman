// app/(tabs)/tentang.tsx
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typeScale, spacing } from "../../constants/styles";

export default function TabTentang() {
  return (
    <SafeAreaView style={{ flex: 1, padding: spacing.sedang, gap: spacing.kecil }}>
      <Text
        accessible
        accessibilityLabel="Judul halaman: Tentang Aplikasi"
        style={{
          fontSize: typeScale.judul,
          fontWeight: "bold",
          marginBottom: spacing.kecil,
        }}
      >
        Tentang Aplikasi
      </Text>

      <View style={{ gap: spacing.kecil }}>
        <Text style={{ fontSize: typeScale.isi }}>Nama Aplikasi: Orientasi Jelajah Aman</Text>
        <Text style={{ fontSize: typeScale.isi }}>Versi: 1.0.0</Text>
        {/* Ubah [Nama Kamu] dengan nama lengkapmu */}
        <Text style={{ fontSize: typeScale.isi }}>Pembuat: [Nama Kamu]</Text>
      </View>
    </SafeAreaView>
  );
}