import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Navbar from "../components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBatteryHalf } from "@fortawesome/free-solid-svg-icons";
import { Image } from "expo-image";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNativeStackParamList } from "../types/navigation-types";
import { useNavigation } from "@react-navigation/native";
import ContentGradient from "../layout/content-gradient";
import * as Battery from "expo-battery";
import * as IntentLauncher from "expo-intent-launcher";
import { useMutation } from "@tanstack/react-query";

type Props = NativeStackScreenProps<
  RootNativeStackParamList,
  "IgnoreBatteryOptimizationsPermission"
>;

export default function IgnoreBatteryOptimizationsPermissionScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Props["navigation"]>();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let result = await Battery.isBatteryOptimizationEnabledAsync();
      if (result === true) {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS
        );
        result = await Battery.isBatteryOptimizationEnabledAsync();
        if (result === false) {
          navigation.navigate("NotificationsPermission");
        }
      } else {
        navigation.navigate("NotificationsPermission");
      }
    },
  });

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Navbar></Navbar>

      <ContentGradient>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={require("../assets/img/battery-optimizations.png")}
            contentFit="contain"
            style={{ height: 280, width: 280 }}
          ></Image>

          <Text
            style={{
              height: 70,
              maxWidth: 300,
              textAlign: "center",
              fontSize: 25,
              fontWeight: "bold",
              color: theme.colors.primary,
            }}
          >
            Disable battery optimizations
          </Text>
          <Text
            style={{
              height: 70,
              maxWidth: 300,
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Disable battery optimizations to prevent the app from being stopped
            when the phone is not in use
          </Text>
        </View>
      </ContentGradient>

      <View style={{ backgroundColor: theme.colors.surface, padding: 20 }}>
        <Button
          mode="contained"
          icon={({ color, size }) => (
            <FontAwesomeIcon
              icon={faBatteryHalf}
              color={color}
              size={size}
            ></FontAwesomeIcon>
          )}
          contentStyle={{ padding: 7, flexDirection: "row-reverse" }}
          loading={isPending}
          onPress={() => mutate()}
        >
          Disable
        </Button>
      </View>
    </View>
  );
}
