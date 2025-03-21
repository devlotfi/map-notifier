import { View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { MapType } from "../types/map-type";
import { Image } from "expo-image";
import { useContext } from "react";
import { MapContext } from "../context/map-context";

interface Props {
  actionMapType: MapType;
}

const lightMap = require("../assets/img/light-map.png");
const darkMap = require("../assets/img/dark-map.png");
const satelliteMap = require("../assets/img/satellite-map.png");

export default function MapTypeComponent({ actionMapType }: Props) {
  const theme = useTheme();
  const { mapType, setMapType } = useContext(MapContext);

  return (
    <Card
      onPress={() => setMapType(actionMapType)}
      mode="outlined"
      style={{
        flex: 1,
        borderRadius: 20,
        borderColor:
          mapType === actionMapType
            ? theme.colors.primary
            : theme.colors.outline,
      }}
    >
      <Card.Content>
        <Image
          source={
            actionMapType === MapType.SATELLITE
              ? satelliteMap
              : theme.dark
              ? darkMap
              : lightMap
          }
          style={{ height: 130, width: "100%", borderRadius: 10 }}
        ></Image>
        <Text
          style={{
            textAlign: "center",
            paddingTop: 10,
            fontSize: 15,
            color:
              mapType === actionMapType
                ? theme.colors.primary
                : theme.colors.onBackground,
            fontWeight: mapType === actionMapType ? "bold" : "regular",
          }}
        >
          {actionMapType === MapType.SATELLITE ? "Satellite" : "Streets"}
        </Text>
      </Card.Content>
    </Card>
  );
}
