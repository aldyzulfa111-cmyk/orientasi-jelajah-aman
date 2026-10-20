// src/components/SearchBox.tsx
import { useState } from "react";
import { View, TextInput } from "react-native";
import { useTheme } from "../context/ThemeContext";
interface SearchBoxProps {
  onCari: (teks: string) => void;
}
export default function SearchBox({ onCari }: SearchBoxProps) {
  const [teks, setTeks] = useState("");
  const { isDarkMode } = useTheme();
  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }
  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={isDarkMode ? "#888888" : "#999999"}
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          padding: 8,
          borderRadius: 8,
          borderColor: isDarkMode ? "#555555" : "#cccccc",
          color: isDarkMode ? "#ffffff" : "#000000",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
        }}
      />
    </View>
  );
}
