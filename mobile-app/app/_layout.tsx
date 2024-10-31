import { Stack, Link, Href } from "expo-router";
import { Text, useColorScheme, View } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { Colors } from "@/constants/Colors";

library.add(faCircleUser)
library.add(faCamera)

type HeaderNavigationButtonProps = {
    route: Href;
    icon: IconProp;
    text: string;
}

function HeaderNavigationButton(props: HeaderNavigationButtonProps) {
    const colorScheme = useColorScheme();

    return (
        <Link href={props.route}>
            <View style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                flexDirection: "row"
            }}>
                <FontAwesomeIcon icon={props.icon} size={20} color={colorScheme == "dark" ? Colors.dark.icon : Colors.light.icon} />
                <Text style={{
                    color: colorScheme == "dark" ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected
                }}> {props.text}</Text>
            </View>
        </Link>
    );
}

export default function RootLayout() {
    return (
        <ToastProvider>
            <Stack>
                <Stack.Screen name="index" options={({ navigation }) => ({
                    presentation: 'modal',
                    headerRight: () => <HeaderNavigationButton route="/profilescreen" icon={["far", "circle-user"]} text="Profile" />,
                })} />
                <Stack.Screen name="camerascreen" options={{ presentation: "modal" }} />
                <Stack.Screen name="profilescreen" />
                <Stack.Screen name="chatgptTest" options={{ presentation: "modal" }} />
            </Stack>
        </ToastProvider>
    );
}
