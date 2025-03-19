import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import * as Location from "expo-location";
import { Tasks } from "../types/tasks";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { DateUtils } from "../utils/date-utils";
import { Audio } from "expo-av";
import { NotificationChannels } from "../types/notification-channels";
import { MapType } from "../types/map-type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeys } from "../types/async-storage-keys";

interface LocationContext {
  location?: Location.LocationObject;
}

const initialValue: LocationContext = {};

export const LocationContext = createContext(initialValue);

export function LocationProvider({ children }: PropsWithChildren) {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

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
              notificationColor: "#4568E7",
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

  useEffect(() => {
    locationUpdateHandler = async (location: Location.LocationObject) => {
      setLocation(location);

      if (count === 5) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "You arrived at your destination",
            body: `Arrival time: ${DateUtils.formatDateTime(new Date())}`,
          },

          trigger: {
            seconds: 5,
            channelId: NotificationChannels.MAP_NOTIFICATIONS,
          },
        });

        const { sound } = await Audio.Sound.createAsync(
          require("../assets/audio/morningjoy.wav")
        );
        setSound(sound);
        await sound.playAsync();
      }
    };

    return () => {
      locationUpdateHandler = null;
    };
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
}

let count = 0;

let locationUpdateHandler: Function | null = null;

TaskManager.defineTask(Tasks.LOCATION, async ({ data, error }: any) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error);

    return;
  }
  if (data) {
    console.log(count);

    if (locationUpdateHandler) {
      locationUpdateHandler(data["locations"][0]);
    }

    if (count === 5) {
      /* Notifications.scheduleNotificationAsync({
        content: {
          title: "Look at that notification",
          body: "I'm so proud of myself!",
        },
        trigger: {
          seconds: 5,
          channelId: "MapNotifications",
        },
      }); */
    }
    count++;
    console.log(data["locations"][0], "task");

    // do something with the locations captured in the background
  }
});
