import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Navbar from "../components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleDoubleRight, faBell } from "@fortawesome/free-solid-svg-icons";
import { Image } from "expo-image";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNativeStackParamList } from "../types/navigation-types";
import { useNavigation } from "@react-navigation/native";
import ContentGradient from "../layout/content-gradient";

type Props = NativeStackScreenProps<RootNativeStackParamList, "VolumeConfig">;

export default function VolumeConfigScreen() {
  const theme = useTheme();
  const navigation = useNavigation<Props["navigation"]>();

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
            source={require("../assets/img/volume-config.png")}
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
            Adjust volume
          </Text>
          <Text
            style={{
              height: 70,
              maxWidth: 300,
              textAlign: "center",
              fontSize: 18,
            }}
          >
            This app relies on the media volume to emit the alarm sound, make
            sure you set it to your desired level
          </Text>
        </View>
      </ContentGradient>

      <View style={{ backgroundColor: theme.colors.surface, padding: 20 }}>
        <Button
          mode="contained"
          icon={({ color, size }) => (
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              color={color}
              size={size}
            ></FontAwesomeIcon>
          )}
          contentStyle={{ padding: 7, flexDirection: "row-reverse" }}
          onPress={() => navigation.navigate("Home")}
        >
          Finish configuration
        </Button>
      </View>
    </View>
  );
}
