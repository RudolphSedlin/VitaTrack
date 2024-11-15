import {
    View,
    StyleSheet,
    useColorScheme,
    FlatList,
    ScrollView,
    Text,
    TextInput,
    Alert,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Link, router, useNavigation } from "expo-router";
import { useEffect, useState, useRef, createContext, useContext } from "react";
import NavButton from "@/components/NavButton";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import MealSummaryView from "@/components/MealSummaryView";
import DailySummaryView from "@/components/DailySummaryView";
import { useApi } from "@/hooks/useApi";
import {
    LoginRequestBody,
    MealsResponse,
    NoBody,
    RegisterRequestBody,
    UserData,
} from "@/shared/api_types";
import { useToast } from "react-native-toast-notifications";
import { reduceMealData } from "@/shared/mealDataReducer";
import ActionButton from "@/components/ActionButton";
import NavActionButton from "@/components/NavActionButton";

library.add(faCircleUser);
library.add(faCamera);

type SummaryData = {
    calories: number;
    fats: number;
    protiens: number;
    sugars: number;
    carbs: number;
    other: number;
    date: Date;
};

export default function Index() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    const [isRegister, setIsRegister] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [render, setRender] = useState(false);
    const [regRender, setRegRender] = useState(false);
    const [userData, userIsLoading, userError, fetchUser] = useApi<
        UserData,
        LoginRequestBody
    >("/login", "POST", {
        // "1-800-123-4567"
        phoneNumber: phone,
        // "GiantMagnet+318"
        password: password,
    });
    const [registerData, registerIsLoading, registerError, fetchRegisterUser] = useApi<
        UserData,
        RegisterRequestBody
    >("/register", "POST", {
        // "1-800-123-4568"
        phoneNumber: phone,
        // "GiantMagnet+318"
        password: password,
        firstName: firstName,
        lastName: lastName,
        confirmPassword: confirmPassword,
        state: "NJ"
    });
    const [checkUserData, checkUserIsLoading, checkUserError, fetchCheckUser] = useApi<UserData, NoBody>("/user", "GET");

    useEffect(() => {
        navigation.setOptions({ title: "Sign In/Register" });
    }, [navigation]);

    useEffect(() => {
        if (!render) {
            setRender(true);
            return;
        }

        if (userIsLoading) {
            console.log("[login] loading api data...");
        } else {
            console.log("[login] loaded api data!");

            if (userError) {
                Alert.alert("Error!", userError as string);
            } else {
                fetchCheckUser();
            }
        }
    }, [userIsLoading]);

    useEffect(() => {
        if (!regRender) {
            setRegRender(true);
            return;
        }

        if (registerIsLoading) {
            console.log("[register] loading api data...");
        } else {
            console.log("[register] loaded api data!");

            console.log("rdata: ", registerData, registerError);

            if (registerError) {
                Alert.alert("Error!", registerError as string);
            } else {
                fetchCheckUser();
            }
        }
    }, [registerIsLoading]);

    useEffect(() => {
        if (!render) {
            setRender(true);
            return;
        }

        if (checkUserIsLoading) {
            console.log("[login] loading api data...");
        } else {
            console.log("[login] loaded api data!");

            if (userError) {
                Alert.alert("Error!", checkUserError as string);
            } else {
                try {
                    router.back();
                } catch (e) {
                    // baby bye bye bye
                }
            }
        }
    }, [checkUserIsLoading]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {isRegister && <TextInput style={styles.inputText} placeholder="First Name" placeholderTextColor="#0e0e0e" onChangeText={setFirstName} value={firstName} />}
                {isRegister && <TextInput style={styles.inputText} placeholder="Last Name" placeholderTextColor="#0e0e0e" onChangeText={setLastName} value={lastName} />}
                <TextInput style={styles.inputText} placeholder="Phone Number" placeholderTextColor="#0e0e0e" keyboardType={"phone-pad"} onChangeText={setPhone} value={phone} />
                <TextInput style={styles.inputText} secureTextEntry placeholder="Password" placeholderTextColor="#0e0e0e" enterKeyHint="done" onChangeText={setPassword} value={password} />
                {isRegister && <TextInput style={styles.inputText} secureTextEntry placeholder="Confirm Password" placeholderTextColor="#0e0e0e" enterKeyHint="done" onChangeText={setConfirmPassword} value={confirmPassword} />}
            </View>
            <View style={styles.footer}>
                <NavActionButton
                    text={isRegister ? "Returning? Log In." : "New? Register now!"}
                    icon={["far", "circle-user"]}
                    fullWidth={true}
                    onPress={() => {
                        setIsRegister(!isRegister)
                    }}
                />
                <Text style={{paddingTop: 5, paddingBottom: 5}}></Text>
                <ActionButton
                    text={isRegister ? "Register" : "Log In"}
                    icon={["far", "circle-user"]}
                    fullWidth={true}
                    onPress={() => {
                        try {
                            if (isRegister) {
                                fetchRegisterUser();
                            } else {
                                fetchUser();
                            }
                        } catch (e) {
                            
                        }
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    content: {
        flex: 1,
    },
    footer: {
        justifyContent: "center",
        alignItems: "center",
        height: 175,
    },
    inputText: {
        backgroundColor: Colors.light.background,
        color: Colors.light.text,
        borderRadius: 4,
        height: 50,
        marginBottom: 20,
        justifyContent:"center",
        padding: 20
    }
});
