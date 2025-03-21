import { useContext } from "react";
import { Button, Portal, Text, useTheme } from "react-native-paper";
import { MapContext } from "../context/map-context";
import { View } from "react-native";
import ContentGradient from "../layout/content-gradient";
import {
  faAngleDoubleRight,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Image } from "expo-image";

export default function ArrivalModal() {
  const theme = useTheme();
  const {
    showArrivalModal,
    setShowArrivalModal,
    currentSound,
    setDetectionRadius,
  } = useContext(MapContext);

  if (!showArrivalModal) return;
  return (
    <Portal>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
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
              source={require("../assets/img/arrival.png")}
              contentFit="contain"
              style={{ height: 300, width: 300 }}
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
              You arrived at your destination
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
            onPress={async () => {
              if (currentSound) {
                await currentSound.stopAsync();
              }
              setDetectionRadius(0.5);
              setShowArrivalModal(false);
            }}
          >
            Complete
          </Button>
        </View>
      </View>
    </Portal>
  );
}
