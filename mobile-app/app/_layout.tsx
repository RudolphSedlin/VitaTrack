import { Stack, Link } from "expo-router";
import { Pressable, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={({ navigation }) => ({
      presentation: 'modal',
      headerRight: () => <Link href="/profile"><Text>Profile</Text></Link>,
    })} />
      <Stack.Screen name="camerascreen" options={{presentation: "modal"}} />
    </Stack>
  );
}
