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
        try {
          await Location.stopLocationUpdatesAsync(Tasks.LOCATION);
        } catch {}
        await Location.startLocationUpdatesAsync(Tasks.LOCATION, {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
        });
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
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const result = await getPermission();
      console.log(result);
      setLocationEnabled(result);
    })();
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
    console.log(data, "task");

    // do something with the locations captured in the background
  }
});
