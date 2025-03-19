import { useContext } from "react";
import { View } from "react-native";
import { MapContext } from "../context/map-context";
import { Button, useTheme } from "react-native-paper";
import {
  faPerson,
  faUserXmark,
  faMapMarkerAlt,
  faTrashAlt,
  faTimes,
  faLocationCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LocationContext } from "../context/location-context";

export default function MapOverlay() {
  const theme = useTheme();
  const { location } = useContext(LocationContext);
  const {
    destinationLocation,
    setDestinationLocation,
    trackUser,
    setTrackUser,
    destinationSelection,
    setDestinationSelection,
    mapRef,
  } = useContext(MapContext);

  return (
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
      {!trackUser && location && !destinationSelection ? (
        <Button
          mode="outlined"
          textColor={theme.colors.onBackground}
          buttonColor={theme.colors.surface}
          contentStyle={{
            padding: 5,
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
          Follow user
        </Button>
      ) : null}
      {trackUser && !destinationSelection ? (
        <Button
          mode="outlined"
          textColor={theme.colors.onBackground}
          buttonColor={theme.colors.primary}
          contentStyle={{
            padding: 5,
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
          Unfollow user
        </Button>
      ) : null}

      {destinationSelection && !destinationLocation ? (
        <Button
          mode="outlined"
          buttonColor={theme.colors.surface}
          contentStyle={{
            padding: 5,
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
          mode="outlined"
          textColor={theme.colors.errorContainer}
          buttonColor={theme.colors.surface}
          contentStyle={{
            padding: 5,
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
          icon={({ color, size }) => (
            <FontAwesomeIcon
              icon={faLocationCrosshairs}
              color={color}
              size={size}
            ></FontAwesomeIcon>
          )}
          onPress={() => setDestinationSelection(true)}
        >
          Set destination
        </Button>
      ) : null}
    </View>
  );
}
