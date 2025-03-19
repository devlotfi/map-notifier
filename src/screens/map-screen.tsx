import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
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

const CENTER_COORDINATE: [number, number] = [2.3522, 48.8566]; // Paris, France
const RADIUS_IN_KM = 10;

export default function MapScreen() {
  const theme = useTheme();
  const { location } = useContext(LocationContext);
  const {
    mapType,
    destinationLocation,
    trackUser,
    destinationSelection,
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
          {trackUser && location ? (
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
              shape={createGeoJSONCircle(destinationLocation, 1)}
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

          {location && destinationLocation ? (
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
                  lineColor: "red",
                  lineWidth: 4,
                  lineCap: "round",
                }}
              ></LineLayer>
            </ShapeSource>
          ) : null}

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
      </View>
    </ContentGradient>
  );
}
