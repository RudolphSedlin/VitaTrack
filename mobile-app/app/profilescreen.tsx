import { View, StyleSheet, useColorScheme, Text, TextInput } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link, router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import NavButton from "@/components/NavButton";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons"
import { faCamera, faCheck, faPencil } from "@fortawesome/free-solid-svg-icons"
import NavActionButton from "@/components/NavActionButton";
import ActionButton from "@/components/ActionButton";
import { useApi } from "@/hooks/useApi";
import { NoBody, UserData, UserUpdateBody } from "@/shared/api_types";

library.add(faCircleUser)
library.add(faCamera)
library.add(faCheck)
library.add(faPencil)

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    let [isEditing, setIsEditing] = useState(false);

    const [i, setI] = useState(false);
    const [userData, userIsLoading, userError, fetchUser] = useApi<UserData, NoBody>("/user", "GET");
    const [signoutData, signoutIsLoading, signoutError, fetchSignout] = useApi<string, NoBody>("/logout", "GET");

    const [firstName, setFirstName] = useState<string | undefined>(undefined);
    const [lastName, setLastName] = useState<string | undefined>(undefined);
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
    const [userState, setUserState] = useState<string | undefined>(undefined);
    const [address, setAddress] = useState<string | undefined>(undefined);
    const [gender, setGender] = useState<string | undefined>(undefined);
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [weight, setWeight] = useState<number | undefined>(undefined);
    const [height, setHeight] = useState<number | undefined>(undefined);

    const [updatedUserData, userIsUpdating, updateError, fetchUpdate] = useApi<UserData, UserUpdateBody>("/user", "PUT", {
        firstName,
        lastName, 
        phoneNumber,
        email,
        state: userState,
        address,
        gender,
        dateOfBirth,
        weight,
        height,
    });

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (userIsLoading) {

        } else if (userData != null) {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setPhoneNumber(userData.phoneNumber);
            setUserState(userData.state);
            setAddress(userData.address);
            setGender(userData.gender);
            setDateOfBirth(userData.dateOfBirth);
            setEmail(userData.email);
            setWeight(userData.weight);
            setHeight(userData.height);
        }

    }, [userIsLoading]);

    useEffect(() => {
        if (userIsUpdating) {

        } else if (updatedUserData != null) {
            setFirstName(updatedUserData.firstName);
            setLastName(updatedUserData.lastName);
            setPhoneNumber(updatedUserData.phoneNumber);
            setUserState(updatedUserData.state);
            setAddress(updatedUserData.address);
            setGender(updatedUserData.gender);
            setEmail(updatedUserData.email);
            setDateOfBirth(updatedUserData.dateOfBirth);
            setWeight(updatedUserData.weight);
            setHeight(updatedUserData.height);
        }
    }, [userIsUpdating])

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

    useEffect(() => {
        if (!i) {
            setI(!i);
            return;
        }
        
        if (signoutIsLoading) {

        } else {
            router.dismiss();
        }
    }, [signoutIsLoading]);

    if (!userData) {
        return <Text>Loading User Data...</Text>
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>First Name</Text>
                    {isEditing ? <TextInput style={v_styles.infoValue} value={firstName} onChangeText={setFirstName} /> : <Text style={v_styles.infoValue}>{firstName}</Text>}
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Last Name</Text>
                    {isEditing ? <TextInput style={v_styles.infoValue} value={lastName} onChangeText={setLastName} /> : <Text style={v_styles.infoValue}>{lastName}</Text>}
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Phone Number</Text>
                    {isEditing ? <TextInput style={v_styles.infoValue} value={phoneNumber} onChangeText={setPhoneNumber} /> : <Text style={v_styles.infoValue}>{phoneNumber}</Text>}
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>State</Text>
                    {isEditing ? <TextInput style={v_styles.infoValue} value={userState} onChangeText={setUserState} /> : <Text style={v_styles.infoValue}>{userState}</Text>}
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Address</Text>
                    {isEditing ? <TextInput style={v_styles.infoValue} value={address} onChangeText={setUserState} /> : <Text style={v_styles.infoValue}>{address ? address : "No Address"}</Text>}
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Gender</Text>
                    {isEditing ? <TextInput style={v_styles.infoValue} value={gender} onChangeText={setGender} /> : <Text style={v_styles.infoValue}>{gender ? gender : "Not Set"}</Text>}
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Date of Birth</Text>
                    {isEditing ? <TextInput style={v_styles.infoValue} value={new Date(dateOfBirth ? dateOfBirth : 0).toLocaleDateString()} onChangeText={t => {try { setDateOfBirth(new Date(t)) } catch (e) {setDateOfBirth(new Date(0))}}} /> : <Text style={v_styles.infoValue}>{dateOfBirth ? new Date(dateOfBirth ? dateOfBirth : 0).toLocaleDateString() : "Not Set"}</Text>}
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Consent Letter</Text>
                    <NavActionButton text="View" icon={["fas", "check"]} onPress={() => {  }} fullWidth={false} />
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Email</Text>
                    {isEditing ? <TextInput style={v_styles.infoValue} value={email} onChangeText={setEmail} /> : <Text style={v_styles.infoValue}>{email ? email : "No Email"}</Text>}
                </View>

                <View style={v_styles.infoListing}>
                    <Text style={v_styles.infoKey}>Height, Weight</Text>
                    <Text style={v_styles.infoValue}>{userData.height ? userData.height : "N/A"}in, {userData.weight ? userData.weight : "N/A"}lbs</Text>
                </View>
            </View>
            <View style={styles.footer}>
                {isEditing && <ActionButton icon={["fas", "check"]} text="Save Changes" fullWidth={false} onPress={() => {
                    setFirstName(userData.firstName);
                    setLastName(userData.lastName);
                    setPhoneNumber(userData.phoneNumber);
                    setUserState(userData.state);
                    setAddress(userData.address);
                    setGender(userData.gender);
                    setDateOfBirth(userData.dateOfBirth);
                    setEmail(userData.email);
                    setWeight(userData.weight);
                    setHeight(userData.height);

                    setIsEditing(false); 
                    fetchUpdate();
                    }} />}
                {!isEditing && <ActionButton icon={["far", "circle-user"]} text="Sign Out" fullWidth={false} onPress={() => { fetchSignout(); }} />}
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