import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppState, useColorScheme } from "react-native";
import { BottomNavigation, PaperProvider, useTheme } from "react-native-paper";
import { CommonActions, NavigationContainer } from "@react-navigation/native";
import { RootNativeStackParamList } from "./types/navigation-types";
import StartScreen from "./screens/start-screen";
import { darkTheme, lightTheme } from "./types/themes";
import StatusBarLayout from "./layout/status-bar-layout";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGear, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import MapScreen from "./screens/map-screen";
import SettingsScreen from "./screens/settings-screen";
import { KeyboardProvider } from "./context/keyboard-context";
import Navbar from "./components/navbar";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as NavigationBar from "expo-navigation-bar";
import { LocationProvider } from "./context/location-context";
import ForegroundLocationPermissionScreen from "./screens/foreground-location-permission-screen";
import BackgroundLocationPermissionScreen from "./screens/background-location-permission-screen";
import NotificationsPermissionScreen from "./screens/notifications-permission-screen";
import IgnoreBatteryOptimizationsPermissionScreen from "./screens/ignore-battery-optimizations-permission-screen";
import { useEffect } from "react";
import { Alarms } from "./types/alarms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationChannels } from "./types/notification-channels";
import { MapProvider } from "./context/map-context";

async function initialConfig() {
  AppState.addEventListener("change", async (nextAppState) => {
    if (nextAppState === "inactive") {
      await TaskManager.unregisterAllTasksAsync();
    }
  });

  await Notifications.setNotificationChannelAsync(
    NotificationChannels.MAP_NOTIFICATIONS,
    {
      name: "Map Notifications",
      importance: Notifications.AndroidImportance.HIGH,
    }
  );

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}
initialConfig();

const BottomTabs = createBottomTabNavigator();

function BottomTabsComponent() {
  const theme = useTheme();

  return (
    <LocationProvider>
      <MapProvider>
        <BottomTabs.Navigator
          screenOptions={{
            animation: "shift",
            header: () => {
              return <Navbar></Navbar>;
            },
          }}
          tabBar={({ navigation, state, descriptors, insets }) => (
            <BottomNavigation.Bar
              style={{
                backgroundColor: theme.colors.surface,
              }}
              activeIndicatorStyle={{
                backgroundColor: theme.colors.primary,
              }}
              navigationState={state}
              safeAreaInsets={insets}
              onTabPress={({ route, preventDefault }) => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (event.defaultPrevented) {
                  preventDefault();
                } else {
                  navigation.dispatch({
                    ...CommonActions.navigate(route.name, route.params),
                    target: state.key,
                  });
                }
              }}
              renderIcon={({ route, focused, color }) => {
                const { options } = descriptors[route.key];
                if (options.tabBarIcon) {
                  return options.tabBarIcon({ focused, color, size: 22 });
                }

                return null;
              }}
              getLabelText={({ route }) => {
                const { options } = descriptors[route.key];
                return options.tabBarLabel as string;
              }}
            />
          )}
        >
          <BottomTabs.Screen
            name="Map"
            component={MapScreen}
            options={{
              tabBarLabel: "Map",
              tabBarIcon: ({ color, size }) => {
                return (
                  <FontAwesomeIcon
                    icon={faMapMarkedAlt}
                    size={size}
                    color={color}
                  />
                );
              },
            }}
          />
          <BottomTabs.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: "Settings",
              tabBarIcon: ({ color, size }) => {
                return (
                  <FontAwesomeIcon icon={faGear} size={size} color={color} />
                );
              },
            }}
          />
        </BottomTabs.Navigator>
      </MapProvider>
    </LocationProvider>
  );
}

const RootNativeStack = createNativeStackNavigator<RootNativeStackParamList>();

function RootNativeStackComponent() {
  return (
    <RootNativeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootNativeStack.Screen
        name="Start"
        component={StartScreen}
      ></RootNativeStack.Screen>
      <RootNativeStack.Screen
        name="ForegroundLocationPermission"
        component={ForegroundLocationPermissionScreen}
      ></RootNativeStack.Screen>
      <RootNativeStack.Screen
        name="BackgroundLocationPermission"
        component={BackgroundLocationPermissionScreen}
      ></RootNativeStack.Screen>
      <RootNativeStack.Screen
        name="IgnoreBatteryOptimizationsPermission"
        component={IgnoreBatteryOptimizationsPermissionScreen}
      ></RootNativeStack.Screen>
      <RootNativeStack.Screen
        name="NotificationsPermission"
        component={NotificationsPermissionScreen}
      ></RootNativeStack.Screen>
      <RootNativeStack.Screen
        name="Home"
        component={BottomTabsComponent}
      ></RootNativeStack.Screen>
    </RootNativeStack.Navigator>
  );
}

function App() {
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      await NavigationBar.setBackgroundColorAsync(theme.colors.surface);
    })();
  }, [theme]);

  return (
    <NavigationContainer>
      <RootNativeStackComponent></RootNativeStackComponent>
    </NavigationContainer>
  );
}

const queryClient = new QueryClient();

export default function Providers() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider theme={colorScheme === "light" ? lightTheme : darkTheme}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <StatusBarLayout>
            <App></App>
          </StatusBarLayout>
        </KeyboardProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}
