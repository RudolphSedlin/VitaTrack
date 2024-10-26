import { Text, View } from "react-native";
import QueryModel from "../components/QueryModel";
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
            <QueryModel />
        </View>
    );
}
