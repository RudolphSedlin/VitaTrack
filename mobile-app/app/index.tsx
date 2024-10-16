import { View, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link, useNavigation } from "expo-router";
import { useEffect } from "react";
import NavButton from "@/components/NavButton";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons" 

library.add(faCircleUser)

export default function Index() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ title: "Home" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>

      </View>
      <View style={styles.footer}>
        <NavButton screen={"/camerascreen"} text="Take Photo" icon={["far", "circle-user"]} fullWidth={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12
  },
  content: {
    flex: 1
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100
  }
})