import { Text, View } from "react-native";
import TensorCamera from "../components/TensorCamera";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function CameraScreen() {
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <TensorCamera />
    </View>
  );
}
