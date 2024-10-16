import { Text, View, StyleSheet, Pressable, useColorScheme } from "react-native";
import TensorCamera from "../components/TensorCamera";
import { Colors } from "../constants/Colors";
import { Link, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ title: "Home" });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link style={colorScheme == "dark" ? styles.darkButton : styles.lightButton} href="/camerascreen">
        <Text style={colorScheme == "dark" ? styles.darkText : styles.lightText}>Take New Photo</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  lightButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: Colors.light.icon,
  },
  darkButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: Colors.dark.icon,
  },
  lightText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: Colors.light.buttonText,
  },
  darkText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: Colors.dark.buttonText,
  },
})