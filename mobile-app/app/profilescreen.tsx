import { View, StyleSheet, useColorScheme, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import NavButton from "@/components/NavButton";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons"
import { faCamera, faCheck, faPencil } from "@fortawesome/free-solid-svg-icons"
import NavActionButton from "@/components/NavActionButton";
import ActionButton from "@/components/ActionButton";
import { useApi } from "@/hooks/useApi";
import { NoBody, UserData } from "@/shared/api_types";

library.add(faCircleUser)
library.add(faCamera)
library.add(faCheck)
library.add(faPencil)

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    let [isEditing, setIsEditing] = useState(false);

    const [userData, userIsLoading, userError, fetchUser] = useApi<UserData, NoBody>("/user", "GET");

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (userIsLoading) {

        } else {
            
        }
    }, [userIsLoading]);

    function toggleIsEditing() {
        setIsEditing(!isEditing)
    }

    useEffect(() => {
        navigation.setOptions({ title: "Profile" });
        navigation.setOptions({ headerRight: () => <NavActionButton text={isEditing ? "Cancel" : "Edit"} icon={isEditing ? ["fas", "xmark"] : ["fas", "pencil"]} fullWidth={false} onPress={toggleIsEditing} /> })
    }, [navigation, isEditing]);

    const v_styles = StyleSheet.create({
        infoKey: {
            fontWeight: "bold",
            fontSize: 16,
            color: colorScheme == "dark" ? Colors.dark.text : Colors.light.text
        },
        infoValue: {
            fontSize: 16,
            color: "gray"
        },
        infoListing: {
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            backgroundColor: colorScheme == "dark" ? Colors.dark.background : Colors.light.background,
            padding: 12,
            borderRadius: 4,
            borderColor: "lightgray",
            borderWidth: 1,
            marginBottom: 10
        }
    })

    if (!userData) {
        return <Text>Loading User Data...</Text>
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>First Name</Text>
                    <Text style={v_styles.infoValue}>{userData.firstName}</Text>
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Last Name</Text>
                    <Text style={v_styles.infoValue}>{userData.lastName}</Text>
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Phone Number</Text>
                    <Text style={v_styles.infoValue}>{userData.phoneNumber}</Text>
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>State</Text>
                    <Text style={v_styles.infoValue}>{userData.state}</Text>
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Address</Text>
                    <Text style={v_styles.infoValue}>{userData.address ? userData.address : "No Address"}</Text>
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Gender</Text>
                    <Text style={v_styles.infoValue}>{userData.gender ? userData.gender : "Not Set"}</Text>
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Date of Birth</Text>
                    <Text style={v_styles.infoValue}>{userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : "Not Set"}</Text>
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Consent Letter</Text>
                    <NavActionButton text="View" icon={["fas", "check"]} onPress={() => {  }} fullWidth={false} />
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Email</Text>
                    <Text style={v_styles.infoValue}>{userData.email ? userData.email : "No Email"}</Text>
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Height, Weight</Text>
                    <Text style={v_styles.infoValue}>{userData.height ? userData.height : "N/A"}in, {userData.weight ? userData.weight : "N/A"}lbs</Text>
                </View>
            </View>
            <View style={styles.footer}>
                {isEditing && <ActionButton icon={["fas", "check"]} text="Save Changes" fullWidth={false} onPress={() => { setIsEditing(false) }} />}
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
});