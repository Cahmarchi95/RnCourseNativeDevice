import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import AllPlaces from "./src/screens/AllPlaces";
import AddPlace from "./src/screens/AddPlace";
import IconButton from "./src/components/UI/IconButton";
import { Colors } from "./src/constants/colors";
import Map from "./src/screens/Map";
import { useEffect, useState, useCallback } from "react";
import { init } from "./src/util/database";
import * as SplashScreen from "expo-splash-screen";
import Entypo from "@expo/vector-icons/Entypo";
import * as Font from "expo-font";
import PlaceDetails from "./src/screens/PlaceDetails";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        init();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setDbInitialized(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary500 },
            headerTintColor: Colors.gray700,
            contentStyle: { backgroundColor: Colors.gray700 },
          }}
        >
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: "Your Favorite Places",
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon="add"
                  size={24}
                  color={tintColor}
                  onPress={() => navigation.navigate("AddPlace")}
                />
              ),
            })}
          />
          <Stack.Screen
            name="AddPlace"
            component={AddPlace}
            options={{
              title: "Add a new Place",
            }}
          />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen
            name="PlaceDetails"
            component={PlaceDetails}
            options={{
              title: "Loading Place...",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
