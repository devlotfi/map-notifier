import { LinearGradient } from "expo-linear-gradient";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export default function ContentGradient({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <LinearGradient
        colors={[theme.colors.surface, "transparent"]}
        style={{
          height: 50,
          width: "100%",
          position: "absolute",
          top: 0,
          zIndex: 1,
        }}
        pointerEvents="none"
      ></LinearGradient>

      <View
        style={{
          flex: 1,
        }}
      >
        {children}
      </View>

      <LinearGradient
        colors={["transparent", theme.colors.surface]}
        style={{
          height: 50,
          width: "100%",
          position: "absolute",
          bottom: 0,
          zIndex: 1,
        }}
        pointerEvents="none"
      ></LinearGradient>
    </View>
  );
}
