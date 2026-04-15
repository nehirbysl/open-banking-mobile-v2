// Runs BEFORE expo-router initialises its internals. enableScreens(false)
// must be called while react-native-screens native module is still dormant
// — once any screen is rendered, flipping it has no effect.
import { enableScreens } from "react-native-screens";
enableScreens(false);

// Then hand off to expo-router's default entry.
import "expo-router/entry";
