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
import { AsyncStorageKeys } from "../types/async-storage-keys";
import { Alarms } from "../types/alarms";
import { MapViewRef } from "@maplibre/maplibre-react-native";

interface MapContextState {
  mapType: MapType;
  setMapType: (value: MapType) => void;

  alarmSound: Alarms;
  setAlarmSound: (value: Alarms) => void;

  destinationLocation: GeoJSON.Position | null;
  setDestinationLocation: (value: GeoJSON.Position | null) => void;

  trackUser: boolean;
  setTrackUser: (value: boolean) => void;

  destinationSelection: boolean;
  setDestinationSelection: (value: boolean) => void;

  mapRef: RefObject<MapViewRef>;
}

const initialValue: MapContextState = {
  mapType: MapType.STREETS,
  setMapType() {},

  alarmSound: Alarms.MORNING_JOY,
  setAlarmSound() {},

  destinationLocation: null,
  setDestinationLocation() {},

  trackUser: false,
  setTrackUser() {},

  destinationSelection: false,
  setDestinationSelection() {},

  mapRef: createRef<MapViewRef>(),
};

export const MapContext = createContext(initialValue);

export function MapProvider({ children }: PropsWithChildren) {
  const [mapType, setMapTypeState] = useState<MapType>(initialValue.mapType);
  const [alarmSound, setAlarmSoundState] = useState<Alarms>(
    initialValue.alarmSound
  );
  const [destinationLocation, setDestinationLocation] =
    useState<GeoJSON.Position | null>(null);
  const [trackUser, setTrackUser] = useState<boolean>(false);
  const [destinationSelection, setDestinationSelection] =
    useState<boolean>(false);

  const setMapType = async (value: MapType) => {
    await AsyncStorage.setItem(AsyncStorageKeys.MAP_TYPE, value);
    setMapTypeState(value);
  };

  const setAlarmSound = async (value: Alarms) => {
    await AsyncStorage.setItem(AsyncStorageKeys.ALARM_SOUND, value);
    setAlarmSoundState(value);
  };

  useEffect(() => {
    async () => {
      const storageMapType = await AsyncStorage.getItem(
        AsyncStorageKeys.MAP_TYPE
      );
      if (storageMapType) {
        setMapTypeState(storageMapType as MapType);
      } else {
        await AsyncStorage.setItem(AsyncStorageKeys.MAP_TYPE, mapType);
      }
    };
  }, []);

  useEffect(() => {
    async () => {
      const storageAlarmSound = await AsyncStorage.getItem(
        AsyncStorageKeys.ALARM_SOUND
      );
      if (storageAlarmSound) {
        setAlarmSoundState(storageAlarmSound as Alarms);
      } else {
        await AsyncStorage.setItem(AsyncStorageKeys.ALARM_SOUND, alarmSound);
      }
    };
  }, []);

  return (
    <MapContext.Provider
      value={{
        mapType,
        setMapType,
        alarmSound,
        setAlarmSound,
        destinationLocation,
        setDestinationLocation,
        trackUser,
        setTrackUser,
        destinationSelection,
        setDestinationSelection,
        mapRef: initialValue.mapRef,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
