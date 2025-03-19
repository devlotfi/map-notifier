import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { MapType } from "../types/map-type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeys } from "../types/async-storage-keys";

interface MapContextState {
  mapType: MapType;
  setMapType: (value: MapType) => void;
}

const initialValue: MapContextState = {
  mapType: MapType.STREETS,
  setMapType() {},
};

export const MapContext = createContext(initialValue);

export function MapProvider({ children }: PropsWithChildren) {
  const [mapType, setMapTypeState] = useState<MapType>(initialValue.mapType);

  const setMapType = async (value: MapType) => {
    await AsyncStorage.setItem(AsyncStorageKeys.MAP_TYPE, value);
    setMapTypeState(value);
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

  return (
    <MapContext.Provider value={{ mapType, setMapType }}>
      {children}
    </MapContext.Provider>
  );
}
