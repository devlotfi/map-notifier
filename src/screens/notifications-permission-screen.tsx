import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Navbar from "../components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Image } from "expo-image";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNativeStackParamList } from "../types/navigation-types";
import { useNavigation } from "@react-navigation/native";
import ContentGradient from "../layout/content-gradient";
import { useMutation } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";

type Props = NativeStackScreenProps<
  RootNativeStackParamList,
  "NotificationsPermission"
>;

export default function NotificationsPermissionScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Props["navigation"]>();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      let result = await Notifications.requestPermissionsAsync();
      if (result.granted) {
        navigation.navigate("VolumeConfig");
      }
    },
  });

  return (
    <View
      style={{ backgroundColor: theme.colors.background, flex: 1, zIndex: 10 }}
    >
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
            source={require("../assets/img/notifications.png")}
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
            Allow notifications
          </Text>
          <Text
            style={{
              height: 70,
              maxWidth: 300,
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Allow notifications to trigger an audio alarm when reaching your
            destination
          </Text>
        </View>
      </ContentGradient>

      <View style={{ backgroundColor: theme.colors.surface, padding: 20 }}>
        <Button
          mode="contained"
          icon={({ color, size }) => (
            <FontAwesomeIcon
              icon={faBell}
              color={color}
              size={size}
            ></FontAwesomeIcon>
          )}
          contentStyle={{ padding: 7, flexDirection: "row-reverse" }}
          loading={isPending}
          onPress={() => mutate()}
        >
          Allow
        </Button>
      </View>
    </View>
  );
}
