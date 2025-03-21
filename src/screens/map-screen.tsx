import { View } from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import ContentGradient from "../layout/content-gradient";
import {
  Camera,
  CameraRef,
  CircleLayer,
  FillLayer,
  LineLayer,
  MapView,
  MapViewRef,
  MarkerView,
  ShapeSource,
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
  faMapMarkerAlt,
  faPerson,
  faTimes,
  faTrashAlt,
  faUser,
  faUserXmark,
} from "@fortawesome/free-solid-svg-icons";
import { MapContext } from "../context/map-context";
import { MapType } from "../types/map-type";
import Crosshair from "../components/crosshair";
import MapOverlay from "../components/map-overlay";
import {
  createGeoJSONCircle,
  createGeoJSONLine,
  fromLocationObjectToPosition,
} from "../utils/geo-json";

export default function MapScreen() {
  const theme = useTheme();
  const {
    location,
    mapType,
    destinationLocation,
    trackUser,
    destinationSelection,
    detectionRadius,
    mapRef,
  } = useContext(MapContext);

  return (
    <ContentGradient>
      <View
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          position: "relative",
        }}
      >
        <MapOverlay></MapOverlay>
        {destinationSelection ? <Crosshair></Crosshair> : null}
        {location ? (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            compassViewPosition={2}
            compassViewMargins={{
              x: 20,
              y: 30,
            }}
            mapStyle={`https://api.maptiler.com/maps/${
              mapType === MapType.SATELLITE
                ? "satellite"
                : theme.dark
                ? "streets-v2-dark"
                : "streets-v2"
            }/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_API_KEY}`}
          >
            {trackUser ? (
              <Camera
                centerCoordinate={[
                  location.coords.longitude,
                  location.coords.latitude,
                ]}
              ></Camera>
            ) : null}

            {destinationLocation ? (
              <ShapeSource
                id="circleSource"
                shape={createGeoJSONCircle(
                  destinationLocation,
                  detectionRadius
                )}
              >
                <FillLayer
                  id="circleLayer"
                  style={{
                    fillColor: theme.colors.primary,
                    fillOpacity: 0.3,
                  }}
                ></FillLayer>
              </ShapeSource>
            ) : null}

            {destinationLocation ? (
              <ShapeSource
                id="lineSource"
                shape={createGeoJSONLine(
                  fromLocationObjectToPosition(location),
                  destinationLocation
                )}
              >
                <LineLayer
                  id="lineLayer"
                  style={{
                    lineColor: theme.colors.secondary,
                    lineWidth: 4,
                    lineCap: "round",
                  }}
                ></LineLayer>
              </ShapeSource>
            ) : null}

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

            {destinationLocation ? (
              <MarkerView
                coordinate={[destinationLocation[0], destinationLocation[1]]}
              >
                <FontAwesomeIcon
                  icon={faLocationCrosshairs}
                  color={theme.colors.primary}
                  size={35}
                ></FontAwesomeIcon>
              </MarkerView>
            ) : null}
          </MapView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              animating
              size="large"
              color={theme.colors.primary}
            ></ActivityIndicator>
          </View>
        )}
      </View>
    </ContentGradient>
  );
}
