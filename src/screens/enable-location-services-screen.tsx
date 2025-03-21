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
import * as Location from "expo-location";
import { useMutation } from "@tanstack/react-query";

type Props = NativeStackScreenProps<
  RootNativeStackParamList,
  "EnableLocationServices"
>;

export default function EnableLocationServicesScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Props["navigation"]>();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let enabled = await Location.hasServicesEnabledAsync();
      if (enabled) {
        navigation.navigate("IgnoreBatteryOptimizationsPermission");
      } else {
        await Location.getCurrentPositionAsync();
        enabled = await Location.hasServicesEnabledAsync();
        if (enabled) {
          navigation.navigate("IgnoreBatteryOptimizationsPermission");
        }
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
            source={require("../assets/img/location-services.png")}
            contentFit="contain"
            style={{ height: 230, width: 230 }}
          ></Image>

          <Text
            style={{
              height: 50,
              maxWidth: 300,
              textAlign: "center",
              fontSize: 25,
              color: theme.colors.primary,
              fontWeight: "bold",
            }}
          >
            Enable location services
          </Text>
          <Text
            style={{
              height: 50,
              maxWidth: 300,
              textAlign: "center",
              fontSize: 20,
            }}
          >
            Turn on location services
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
          contentStyle={{ padding: 7, flexDirection: "row-reverse" }}
          onPress={() => mutate()}
        >
          Enable
        </Button>
      </View>
    </View>
  );
}
