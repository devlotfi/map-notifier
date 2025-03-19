import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import ContentGradient from "../layout/content-gradient";
import {
  MapView,
  MapViewRef,
  MarkerView,
  UserLocationRef,
} from "@maplibre/maplibre-react-native";
import { useContext, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Tasks } from "../types/tasks";
import { LocationContext } from "../context/location-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationCrosshairs,
  faPerson,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { MapContext } from "../context/map-context";
import { MapType } from "../types/map-type";

export default function MapScreen() {
  const theme = useTheme();
  const mapRef = useRef<MapViewRef>(null);
  const locationRef = useRef<UserLocationRef>(null);
  const { location } = useContext(LocationContext);
  const { mapType } = useContext(MapContext);

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
          mapStyle={`https://api.maptiler.com/maps/${
            mapType === MapType.SATELLITE
              ? "satellite"
              : theme.dark
              ? "streets-v2-dark"
              : "streets-v2"
          }/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_API_KEY}`}
          onUserLocationUpdate={(data) => console.log(data)}
        >
          {location ? (
            <MarkerView
              coordinate={[location.coords.longitude, location.coords.latitude]}
              anchor={{
                x: 0.5,
                y: 1,
              }}
            >
              <FontAwesomeIcon
                icon={faPerson}
                color={theme.colors.primary}
                size={50}
              ></FontAwesomeIcon>
            </MarkerView>
          ) : null}

          <MarkerView coordinate={[0, 0]}>
            <FontAwesomeIcon
              icon={faLocationCrosshairs}
              color={theme.colors.primary}
              size={35}
            ></FontAwesomeIcon>
          </MarkerView>
        </MapView>
      </View>
    </ContentGradient>
  );
}
