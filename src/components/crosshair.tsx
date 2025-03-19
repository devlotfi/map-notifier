import { View } from "react-native";
import { useTheme } from "react-native-paper";

export default function Crosshair() {
  const theme = useTheme();

  return (
    <View
      pointerEvents="none"
      style={{
        flex: 1,
        zIndex: 1,
        height: "100%",
        width: "100%",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: 100,
          width: 100,
          borderColor: theme.colors.onBackground,
          borderWidth: 1,
          borderRadius: 1000,
          position: "absolute",
        }}
      ></View>
      <View
        style={{
          height: 150,
          width: 2,
          backgroundColor: theme.colors.onBackground,
          borderRadius: 1000,
          position: "absolute",
        }}
      ></View>
      <View
        style={{
          height: 2,
          width: 150,
          backgroundColor: theme.colors.onBackground,
          borderRadius: 1000,
          position: "absolute",
        }}
      ></View>
      <View
        style={{
          height: 10,
          width: 10,
          backgroundColor: theme.colors.onBackground,
          borderRadius: 1000,
          position: "absolute",
        }}
      ></View>
    </View>
  );
}
