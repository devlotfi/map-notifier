import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import * as Location from "expo-location";
import { Tasks } from "../constants";
import * as TaskManager from "expo-task-manager";

interface PermissionContext {
  locationEnabled: boolean;
}

const initialValue: PermissionContext = {
  locationEnabled: false,
};

export const PermissionContext = createContext(initialValue);

async function getPermission(): Promise<boolean> {
  console.log("get permission");

  try {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === "granted") {
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === "granted") {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);

    return false;
  }
}

export function PermissionProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const [locationEnabled, setLocationEnabled] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus === "granted") {
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === "granted") {
          await Location.startLocationUpdatesAsync(Tasks.LOCATION, {
            accuracy: Location.LocationAccuracy.BestForNavigation,
            distanceInterval: 0.1, // Update every 10 meters
            foregroundService: {
              notificationTitle: "Location Tracking Active",
              notificationBody:
                "Your location is being tracked in the background.",
              notificationColor: "#FF5733",
              killServiceOnDestroy: true,
            },
          });
        }
      }
    })();

    return () => {
      (async () => {
        await Location.stopLocationUpdatesAsync(Tasks.LOCATION);
      })();
    };
  }, []);

  if (!locationEnabled) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <ActivityIndicator
          color={theme.colors.primary}
          size="large"
          animating
        ></ActivityIndicator>
      </View>
    );
  }

  return (
    <PermissionContext.Provider value={{ locationEnabled }}>
      {children}
    </PermissionContext.Provider>
  );
}

TaskManager.defineTask(Tasks.LOCATION, async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error);

    return;
  }
  if (data) {
    console.log(data["locations"][0], "task");

    // do something with the locations captured in the background
  }
});
