import { ScrollView, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";
import ContentGradient from "../layout/content-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBell,
  faMapMarkedAlt,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import MapTypeComponent from "../components/map-type-component";
import { MapType } from "../types/map-type";
import AlarmSound from "../components/alarm-sound";
import { Alarms } from "../types/alarms";
import { AVPlaybackSource } from "expo-av";
import { AlarmSources } from "../types/alarm-sources";

export default function SettingsScreen() {
  const theme = useTheme();

  return (
    <ContentGradient>
      <ScrollView
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 10,
            paddingVertical: 30,
          }}
        >
          <FontAwesomeIcon
            icon={faMapMarkedAlt}
            size={30}
            color={theme.colors.primary}
          ></FontAwesomeIcon>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            Map type
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 20 }}>
          <MapTypeComponent actionMapType={MapType.STREETS}></MapTypeComponent>
          <MapTypeComponent
            actionMapType={MapType.SATELLITE}
          ></MapTypeComponent>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 10,
            paddingVertical: 30,
          }}
        >
          <FontAwesomeIcon
            icon={faBell}
            size={30}
            color={theme.colors.primary}
          ></FontAwesomeIcon>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            Alarm sound
          </Text>
        </View>

        <View style={{ gap: 10, paddingBottom: 100 }}>
          <AlarmSound name="Chiptune" alarm={Alarms.CHIPTUNE}></AlarmSound>
          <AlarmSound
            name="Morning Joy"
            alarm={Alarms.MORNING_JOY}
          ></AlarmSound>
          <AlarmSound
            name="Oversimplified"
            alarm={Alarms.OVERSIMPLIFIED}
          ></AlarmSound>
        </View>
      </ScrollView>
    </ContentGradient>
  );
}
