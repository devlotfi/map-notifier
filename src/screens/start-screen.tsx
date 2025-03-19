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

type Props = NativeStackScreenProps<RootNativeStackParamList, "Start">;

export default function StartScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Props["navigation"]>();

  /*   useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
    })();
  }, []); */

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
            source={require("../assets/img/start-map.png")}
            contentFit="contain"
            style={{ height: 280, width: 280 }}
          ></Image>
          <Text
            style={{
              height: 50,
              maxWidth: 300,
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Smart alarms for smart travelers arrive right on time
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
          contentStyle={{ padding: 7 }}
          onPress={() => navigation.navigate("ForegroundLocationPermission")}
        >
          Start
        </Button>
      </View>
    </View>
  );
}
