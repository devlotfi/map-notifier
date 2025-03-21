import { useContext } from "react";
import { View } from "react-native";
import { MapContext } from "../context/map-context";
import { Button, Text, useTheme } from "react-native-paper";
import {
  faPerson,
  faUserXmark,
  faMapMarkerAlt,
  faTrashAlt,
  faTimes,
  faLocationCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Slider from "@react-native-community/slider";
import {
  fromLocationObjectToPosition,
  haversineDistance,
} from "../utils/geo-json";

export default function MapOverlay() {
  const theme = useTheme();
  const {
    destinationLocation,
    setDestinationLocation,
    trackUser,
    setTrackUser,
    destinationSelection,
    setDestinationSelection,
    detectionRadius,
    setDetectionRadius,
    mapRef,
    location,
  } = useContext(MapContext);

  return (
    <>
      {destinationLocation && destinationSelection ? (
        <View
          style={{
            position: "absolute",
            top: 25,
            width: "100%",
            zIndex: 2,
            padding: 10,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: theme.colors.outline,
              padding: 15,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
              Detection radius
            </Text>
            <Slider
              style={{ marginTop: 15, marginBottom: 16 }}
              minimumValue={0.5}
              maximumValue={5}
              step={0.5}
              value={detectionRadius}
              onSlidingComplete={(value) => setDetectionRadius(value)}
              thumbTintColor={theme.colors.primary}
              minimumTrackTintColor={theme.colors.primary}
              StepMarker={({ stepMarked, currentValue }) => (
                <>
                  <View
                    style={{
                      height: 15,
                      top: 2,
                      width: 1,
                      backgroundColor: theme.colors.primary,
                    }}
                  ></View>
                  {stepMarked ? (
                    <Text
                      style={{
                        fontSize: 13,
                        paddingTop: 10,
                      }}
                    >
                      {currentValue} Km
                    </Text>
                  ) : null}
                </>
              )}
            ></Slider>
          </View>
        </View>
      ) : null}

      {!destinationSelection ? (
        <View
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            zIndex: 2,
            gap: 10,
            alignItems: "flex-end",
          }}
        >
          {destinationLocation && location ? (
            <View
              style={{
                height: 60,
                paddingHorizontal: 25,
                backgroundColor: theme.colors.primary,
                borderRadius: 1000,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "#ffffff" }}
              >
                Distance
              </Text>
              <Text style={{ fontSize: 13, color: "#ffffff" }}>
                {(
                  haversineDistance(
                    fromLocationObjectToPosition(location),
                    destinationLocation
                  ) / 1000
                ).toFixed(1)}{" "}
                Km
              </Text>
            </View>
          ) : null}

          {location && location.coords.speed ? (
            <View
              style={{
                height: 60,
                width: 60,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.outline,
                borderRadius: 1000,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {(location.coords.speed * 3.6).toFixed(0)}
              </Text>
              <Text style={{ fontSize: 10 }}>Km/h</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View
        style={{
          position: "absolute",
          bottom: 40,
          right: 20,
          zIndex: 2,
          gap: 10,
          alignItems: "flex-end",
        }}
      >
        {destinationLocation && location && destinationSelection ? (
          <View
            style={{
              height: 60,
              paddingHorizontal: 25,
              backgroundColor: theme.colors.primary,
              borderRadius: 1000,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#ffffff" }}
            >
              Distance
            </Text>
            <Text style={{ fontSize: 13, color: "#ffffff" }}>
              {(
                haversineDistance(
                  fromLocationObjectToPosition(location),
                  destinationLocation
                ) / 1000
              ).toFixed(1)}{" "}
              Km
            </Text>
          </View>
        ) : null}

        {!trackUser && location && !destinationSelection ? (
          <Button
            mode="outlined"
            textColor={theme.colors.onBackground}
            buttonColor={theme.colors.surface}
            contentStyle={{
              padding: 5,
            }}
            style={{
              borderRadius: 1000,
            }}
            icon={({ color, size }) => (
              <FontAwesomeIcon
                icon={faPerson}
                color={color}
                size={size}
              ></FontAwesomeIcon>
            )}
            onPress={() => setTrackUser(true)}
          >
            Follow
          </Button>
        ) : null}
        {trackUser && !destinationSelection ? (
          <Button
            mode="contained"
            textColor="#ffffff"
            buttonColor={theme.colors.primary}
            contentStyle={{
              padding: 5,
            }}
            style={{
              borderRadius: 1000,
            }}
            icon={({ color, size }) => (
              <FontAwesomeIcon
                icon={faUserXmark}
                color={color}
                size={size}
              ></FontAwesomeIcon>
            )}
            onPress={() => setTrackUser(false)}
          >
            Unfollow
          </Button>
        ) : null}

        {destinationSelection && !destinationLocation ? (
          <Button
            mode="contained"
            labelStyle={{ color: "#ffffff" }}
            buttonColor={theme.colors.primary}
            contentStyle={{
              padding: 5,
            }}
            style={{
              borderRadius: 1000,
            }}
            icon={({ color, size }) => (
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                color={color}
                size={size}
              ></FontAwesomeIcon>
            )}
            onPress={async () => {
              if (mapRef.current) {
                const center = await mapRef.current.getCenter();
                setDestinationLocation(center);
              }
            }}
          >
            Set marker
          </Button>
        ) : null}
        {destinationSelection && destinationLocation ? (
          <Button
            mode="contained"
            textColor="#ffffff"
            buttonColor={theme.colors.errorContainer}
            contentStyle={{
              padding: 5,
            }}
            style={{
              borderRadius: 1000,
            }}
            icon={({ color, size }) => (
              <FontAwesomeIcon
                icon={faTrashAlt}
                color={color}
                size={size}
              ></FontAwesomeIcon>
            )}
            onPress={() => setDestinationLocation(null)}
          >
            Remove marker
          </Button>
        ) : null}

        {destinationSelection ? (
          <Button
            mode="outlined"
            textColor={theme.colors.onBackground}
            buttonColor={theme.colors.surface}
            contentStyle={{
              padding: 5,
            }}
            style={{
              borderRadius: 1000,
            }}
            icon={({ color, size }) => (
              <FontAwesomeIcon
                icon={faTimes}
                color={color}
                size={size}
              ></FontAwesomeIcon>
            )}
            onPress={() => setDestinationSelection(false)}
          >
            End selection
          </Button>
        ) : null}
        {!destinationSelection && !trackUser ? (
          <Button
            mode="outlined"
            textColor={theme.colors.onBackground}
            contentStyle={{
              padding: 5,
              backgroundColor: theme.colors.surface,
            }}
            style={{
              borderRadius: 1000,
            }}
            icon={({ color, size }) => (
              <FontAwesomeIcon
                icon={faLocationCrosshairs}
                color={color}
                size={size}
              ></FontAwesomeIcon>
            )}
            onPress={() => setDestinationSelection(true)}
          >
            Destination
          </Button>
        ) : null}
      </View>
    </>
  );
}
