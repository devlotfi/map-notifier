import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppState, useColorScheme } from "react-native";
import {
  BottomNavigation,
  PaperProvider,
  Text,
  useTheme,
} from "react-native-paper";
import { CommonActions, NavigationContainer } from "@react-navigation/native";
import { RootNativeStackParamList } from "./navigation-types";
import StartScreen from "./screens/start-screen";
import { darkTheme, lightTheme } from "./themes";
import StatusBarLayout from "./layout/status-bar-layout";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGear, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import MapScreen from "./screens/map-screen";
import SettingsScreen from "./screens/settings-screen";
import { KeyboardProvider } from "./context/keyboard-context";
import Navbar from "./components/navbar";
import { PermissionProvider } from "./context/permission-context";
import * as TaskManager from "expo-task-manager";

const BottomTabs = createBottomTabNavigator();

function BottomTabsComponent() {
  const theme = useTheme();

  return (
    <PermissionProvider>
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
    </PermissionProvider>
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
        name="Home"
        component={BottomTabsComponent}
      ></RootNativeStack.Screen>
    </RootNativeStack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <RootNativeStackComponent></RootNativeStackComponent>
    </NavigationContainer>
  );
}

export default function Providers() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider theme={colorScheme === "light" ? lightTheme : darkTheme}>
      <KeyboardProvider>
        <StatusBarLayout>
          <App></App>
        </StatusBarLayout>
      </KeyboardProvider>
    </PaperProvider>
  );
}

AppState.addEventListener("change", async (nextAppState) => {
  if (nextAppState === "inactive") {
    console.log("clear tasks");

    await TaskManager.unregisterAllTasksAsync();
  }
});
