import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Navbar from "../components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Image } from "expo-image";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNativeStackParamList } from "../types/navigation-types";
import { useNavigation } from "@react-navigation/native";
import ContentGradient from "../layout/content-gradient";
import { useMutation } from "@tanstack/react-query";
import * as Location from "expo-location";
import { Tasks } from "../types/tasks";

type Props = NativeStackScreenProps<
  RootNativeStackParamList,
  "BackgroundLocationPermission"
>;

export default function BackgroundLocationPermissionScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Props["navigation"]>();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === "granted") {
        await Location.getCurrentPositionAsync();
        navigation.navigate("IgnoreBatteryOptimizationsPermission");
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
            source={require("../assets/img/background-location.png")}
            contentFit="contain"
            style={{ height: 280, width: 280 }}
          ></Image>

          <Text
            style={{
              height: 50,
              maxWidth: 300,
              textAlign: "center",
              fontSize: 25,
              fontWeight: "bold",
              color: theme.colors.primary,
            }}
          >
            Background location
          </Text>
          <Text
            style={{
              height: 70,
              maxWidth: 300,
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Allow acces to your location when the app is in background or the
            phone is locked
          </Text>
          <Text
            style={{
              height: 50,
              maxWidth: 300,
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Select "Always allow"
          </Text>
        </View>
      </ContentGradient>

      <View style={{ backgroundColor: theme.colors.surface, padding: 20 }}>
        <Button
          mode="contained"
          icon={({ color, size }) => (
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              color={color}
              size={size}
            ></FontAwesomeIcon>
          )}
          loading={isPending}
          contentStyle={{ padding: 7 }}
          onPress={() => mutate()}
        >
          Start
        </Button>
      </View>
    </View>
  );
}
