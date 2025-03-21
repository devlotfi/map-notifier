import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { MD3Colors, MD3Theme } from "react-native-paper/lib/typescript/types";

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#4568E7",
    secondary: "#AD3BEF",
    background: "#EAEEFC",
    surface: "#FFFFFF",
    outline: "#C5BDD4",
    errorContainer: "#DD2525",
  } as MD3Colors,
} as MD3Theme;

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#4568E7",
    secondary: "#AD3BEF",
    background: "#192133",
    surface: "#222D46",
    outline: "#435680",
    errorContainer: "#DD2525",
  } as MD3Colors,
} as MD3Theme;
