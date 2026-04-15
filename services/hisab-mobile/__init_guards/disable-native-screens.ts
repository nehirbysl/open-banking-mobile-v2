/**
 * SDK 54 + react-native-screens 4.17 ships a JSI boolean/string
 * type assertion that aborts on app bootstrap under the new arch.
 * Disabling native screens forces JS-rendered screens (no native
 * stack animations, but no crash).
 *
 * Must run BEFORE any expo-router / navigation code imports.
 */
import { enableScreens } from "react-native-screens";
enableScreens(false);
