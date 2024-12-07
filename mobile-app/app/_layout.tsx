import { Stack, Link, Href, router } from "expo-router";
import { Text, useColorScheme, View } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';

import { Colors } from "@/constants/Colors";

import { ModelProvider } from "./ModelContext";
import NavActionButton from "@/components/NavActionButton";
import NavText from "@/components/NavText";
library.add(faCircleUser);
library.add(faCamera);

type HeaderNavigationButtonProps = {
    route: Href;
    icon: IconProp;
    text: string;
};

function HeaderNavigationButton(props: HeaderNavigationButtonProps) {
    const colorScheme = useColorScheme();

    return (
        <Link href={props.route}>
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    flexDirection: "row",
                }}
            >
                <FontAwesomeIcon
                    icon={props.icon}
                    size={20}
                    color={
                        colorScheme == "dark"
                            ? Colors.dark.icon
                            : Colors.light.icon
                    }
                />
                <Text
                    style={{
                        color:
                            colorScheme == "dark"
                                ? Colors.dark.tabIconSelected
                                : Colors.light.tabIconSelected,
                    }}
                >
                    {" "}
                    {props.text}
                </Text>
            </View>
        </Link>
    );
}

export default function RootLayout() {
    return (
        <ModelProvider>
            <ToastProvider>
                <MenuProvider>
                    <Stack>
                        <Stack.Screen
                            name="index"
                            options={({ navigation }) => ({
                                presentation: "modal",
                                headerRight: () => (
                                    <HeaderNavigationButton
                                        route="/profilescreen"
                                        icon={["far", "circle-user"]}
                                        text="Profile"
                                    />
                                ),
                                headerLeft: () => (
                                    <Menu onSelect={v => {
                                        let pV: number = parseInt(v);

                                        let endpoint = "";
                                        let title = "";

                                        if (pV == 2) {
                                            endpoint = "/meals/recommendations"
                                            title = "Recommendations"
                                        } else if (pV == 1) {
                                            endpoint = "/meals/alternatives"
                                            title = "Meal Alternatives"
                                        } else if (pV == 3) {
                                            endpoint = "/meals/report"
                                            title = "Report"
                                        }
                                        console.log(endpoint);
                                        router.push({pathname: "/report", params: {report: endpoint, title: title}})
                                    }}>
                                        <MenuTrigger>
                                            <NavText text="Reports" icon={["fas", "check"]} />
                                        </MenuTrigger>
                                        <MenuOptions customStyles={{
                                            optionsContainer: {
                                                borderRadius: 10,
                                            },
                                        }}>
                                            <MenuOption customStyles={{ 
                                                optionText: {
                                                    fontSize: 18
                                                }
                                            }} value={1} text="Meal Alternatives" />
                                            <View style={{ height: 1, backgroundColor: "#7F8487", }} />
                                            <MenuOption customStyles={{ 
                                                optionText: {
                                                    fontSize: 18
                                                }
                                            }} value={2} text="Diet Recommendations" />
                                            <View style={{ height: 1, backgroundColor: "#7F8487", }} />
                                            <MenuOption customStyles={{ 
                                                optionText: {
                                                    fontSize: 18
                                                }
                                            }} value={3} text="Meals Report" />
                                            <View style={{ height: 1, backgroundColor: "#7F8487", }} />
                                        </MenuOptions>
                                    </Menu>
                                )
                            })}
                        />
                        <Stack.Screen
                            name="camerascreen"
                            options={{ presentation: "modal" }}
                        />
                        <Stack.Screen 
                            name="profilescreen" 
                            options={{ presentation: "modal" }}
                        />
                        <Stack.Screen
                            name="chatgptTest"
                            options={{ presentation: "modal" }}
                        />
                        <Stack.Screen
                            name="login"
                            options={{ presentation: "modal" }}
                        />
                    </Stack>
                </MenuProvider>
            </ToastProvider>
        </ModelProvider>
    );
}
