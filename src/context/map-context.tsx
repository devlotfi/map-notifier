import {
  createContext,
  createRef,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { MapType } from "../types/map-type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { AsyncStorageKeys } from "../types/async-storage-keys";
import { Alarms } from "../types/alarms";
import { MapViewRef } from "@maplibre/maplibre-react-native";
import { Tasks } from "../types/tasks";
import { Audio } from "expo-av";
import { DateUtils } from "../utils/date-utils";
import { NotificationChannels } from "../types/notification-channels";
import {
  fromLocationObjectToPosition,
  haversineDistance,
} from "../utils/geo-json";

interface MapContextState {
  location?: Location.LocationObject;

  mapType: MapType;
  setMapType: (value: MapType) => void;

  alarmSound: Alarms;
  setAlarmSound: (value: Alarms) => void;

  currentSound: Audio.Sound | null;
  setCurrentSound: (value: Audio.Sound | null) => void;

  destinationLocation: GeoJSON.Position | null;
  setDestinationLocation: (value: GeoJSON.Position | null) => void;

  trackUser: boolean;
  setTrackUser: (value: boolean) => void;

  destinationSelection: boolean;
  setDestinationSelection: (value: boolean) => void;

  detectionRadius: number;
  setDetectionRadius: (value: number) => void;

  showArrivalModal: boolean;
  setShowArrivalModal: (value: boolean) => void;

  mapRef: RefObject<MapViewRef>;
}

const initialValue: MapContextState = {
  mapType: MapType.STREETS,
  setMapType() {},

  alarmSound: Alarms.MORNING_JOY,
  setAlarmSound() {},

  currentSound: null,
  setCurrentSound() {},

  destinationLocation: null,
  setDestinationLocation() {},

  trackUser: false,
  setTrackUser() {},

  destinationSelection: false,
  setDestinationSelection() {},

  detectionRadius: 0.5,
  setDetectionRadius() {},

  showArrivalModal: false,
  setShowArrivalModal() {},

  mapRef: createRef<MapViewRef>(),
};

export const MapContext = createContext(initialValue);

const chiptune = require("../assets/audio/chiptune.wav");
const morningjoy = require("../assets/audio/morningjoy.wav");
const oversimplified = require("../assets/audio/oversimplified.wav");

export function MapProvider({ children }: PropsWithChildren) {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [mapType, setMapTypeState] = useState<MapType>(initialValue.mapType);
  const [alarmSound, setAlarmSoundState] = useState<Alarms>(
    initialValue.alarmSound
  );
  const [destinationLocation, setDestinationLocation] =
    useState<GeoJSON.Position | null>(null);
  const destinationLocationRef = useRef<GeoJSON.Position | null>(null);

  const [trackUser, setTrackUser] = useState<boolean>(false);
  const [destinationSelection, setDestinationSelection] =
    useState<boolean>(false);
  const [detectionRadius, setDetectionRadius] = useState<number>(
    initialValue.detectionRadius
  );
  const detectionRadiusRef = useRef<number>(0.5);
  const [showArrivalModal, setShowArrivalModal] = useState<boolean>(false);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    destinationLocationRef.current = destinationLocation;
  }, [destinationLocation]);

  useEffect(() => {
    detectionRadiusRef.current = detectionRadius;
  }, [detectionRadius]);

  useEffect(() => {
    (async () => {
      const storageMapType = await AsyncStorage.getItem(
        AsyncStorageKeys.MAP_TYPE
      );
      setMapTypeState((storageMapType as MapType) || MapType.STREETS);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const storageAlarmSound = await AsyncStorage.getItem(
        AsyncStorageKeys.ALARM_SOUND
      );
      setAlarmSoundState((storageAlarmSound as Alarms) || Alarms.MORNING_JOY);
    })();
  }, []);

  const setMapType = async (value: MapType) => {
    setMapTypeState(value);
    await AsyncStorage.setItem(AsyncStorageKeys.MAP_TYPE, value);
  };

  const setAlarmSound = async (value: Alarms) => {
    setAlarmSoundState(value);
    await AsyncStorage.setItem(AsyncStorageKeys.ALARM_SOUND, value);
  };

  useEffect(() => {
    (async () => {
      console.log(await Location.hasServicesEnabledAsync());
      await Location.startLocationUpdatesAsync(Tasks.LOCATION, {
        accuracy: Location.LocationAccuracy.BestForNavigation,
        distanceInterval: 0.1, // Update every 10 meters
        foregroundService: {
          notificationTitle: "Location Tracking Active",
          notificationBody: "Your location is being tracked in the background.",
          notificationColor: "#4568E7",
          killServiceOnDestroy: true,
        },
      });
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

      if (destinationLocationRef.current) {
        const distance = haversineDistance(
          fromLocationObjectToPosition(location),
          destinationLocationRef.current
        );
        console.log("harvestine distance km: ", distance / 1000);

        if (distance < detectionRadiusRef.current * 1000) {
          setDestinationLocation(null);
          setShowArrivalModal(true);

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

          try {
            setAlarmSoundState((value) => {
              (async () => {
                const getSound = () => {
                  switch (value) {
                    case Alarms.CHIPTUNE:
                      return chiptune;
                    case Alarms.MORNING_JOY:
                      return morningjoy;
                    case Alarms.OVERSIMPLIFIED:
                      return oversimplified;
                  }
                };

                const { sound } = await Audio.Sound.createAsync(getSound());
                console.log("play sound", value);

                setCurrentSound(sound);
                await sound.playAsync();
              })();

              return value;
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    };

    return () => {
      locationUpdateHandler = null;
    };
  }, []);

  useEffect(() => {
    return currentSound
      ? () => {
          currentSound.unloadAsync();
        }
      : undefined;
  }, [currentSound]);

  return (
    <MapContext.Provider
      value={{
        location,
        mapType,
        setMapType,
        alarmSound,
        setAlarmSound,
        currentSound,
        setCurrentSound,
        destinationLocation,
        setDestinationLocation,
        trackUser,
        setTrackUser,
        destinationSelection,
        setDestinationSelection,
        detectionRadius,
        setDetectionRadius,
        showArrivalModal,
        setShowArrivalModal,
        mapRef: initialValue.mapRef,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

let locationUpdateHandler: Function | null = null;

TaskManager.defineTask(Tasks.LOCATION, async ({ data, error }: any) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log(error);

    return;
  }
  if (data) {
    if (locationUpdateHandler !== null) {
      locationUpdateHandler(data["locations"][0]);
    }
    console.log(data["locations"][0], "task");
  }
});
