import { useState } from "react";
import { Text, Button, View, Switch, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { useTheme } from "../../context/ThemeContext";

export default function TabPengaturan() {
  const [pesan, setPesan] = useState<string | null>(null);
  const { isDarkMode, setIsDarkMode } = useTheme();

  async function eksekusiHapusSemua() {
    await hapusSemuaCache();
    setPesan("Data cuaca tersimpan sudah dihapus.");
  }

  function konfirmasiHapusSemua() {
    if (Platform.OS === "web") {
      const yakin = window.confirm("Yakin ingin menghapus seluruh data cache cuaca tersimpan?");
      if (yakin) eksekusiHapusSemua();
    } else {
      Alert.alert(
        "Konfirmasi Hapus",
        "Yakin ingin menghapus seluruh data cache cuaca tersimpan?",
        [
          { text: "Batal", style: "cancel" },
          { text: "Hapus", style: "destructive", onPress: () => eksekusiHapusSemua() },
        ]
      );
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        paddingBottom: 96,
        gap: 16,
        backgroundColor: isDarkMode ? "#121212" : "#ffffff",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", color: isDarkMode ? "#ffffff" : "#000000" }}>
        Jelajah Aman
      </Text>
      <Text style={{ color: isDarkMode ? "#ccc" : "#666" }}>Versi 1.0.0</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 }}>
        <Text style={{ fontSize: 16, color: isDarkMode ? "#ffffff" : "#000000" }}>
          Mode Gelap (Dark Mode)
        </Text>
        <Switch value={isDarkMode} onValueChange={(val) => setIsDarkMode(val)} />
      </View>

      <Button title="Hapus Data Cuaca Tersimpan" color="#ff3b30" onPress={konfirmasiHapusSemua} />
      {pesan && (
        <Text accessibilityLabel={pesan} style={{ color: isDarkMode ? "#4cd964" : "#28a745" }}>
          {pesan}
        </Text>
      )}
    </SafeAreaView>
  );
}