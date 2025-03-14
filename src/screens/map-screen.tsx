import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import ContentGradient from "../layout/content-gradient";
import {
  MapView,
  MapViewRef,
  UserLocationRef,
} from "@maplibre/maplibre-react-native";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Tasks } from "../constants";

export default function MapScreen() {
  const theme = useTheme();
  const mapRef = useRef<MapViewRef>(null);
  const locationRef = useRef<UserLocationRef>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  return (
    <ContentGradient>
      <View
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          position: "relative",
        }}
      >
        <Button
          mode="contained"
          style={{ position: "absolute", top: 50, zIndex: 2 }}
          onPress={async () => {
            console.log(await mapRef.current?.getCenter());
            await locationRef.current?.setLocationManager({
              running: true,
            });
          }}
        >
          lol
        </Button>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          compassViewMargins={{ x: 10, y: 25 }}
          mapStyle={`https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_API_KEY}`}
          onUserLocationUpdate={(data) => console.log(data)}
        ></MapView>
      </View>
    </ContentGradient>
  );
}
