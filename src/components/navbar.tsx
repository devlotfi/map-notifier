import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Image } from "expo-image";

export default function Navbar() {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        gap: 10,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Image
        source={require("../assets/img/logo.png")}
        style={{ height: 35, width: 35 }}
        contentFit="contain"
      ></Image>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Map Notifier
      </Text>
    </View>
  );
}
