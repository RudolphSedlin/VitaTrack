import {
    View,
    StyleSheet,
    useColorScheme,
    FlatList,
    ScrollView,
    Text,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Link, router, useFocusEffect, useNavigation } from "expo-router";
import { useEffect, useState, useRef, createContext, useContext, useReducer, useCallback } from "react";
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
    UserData,
} from "@/shared/api_types";
import { useToast } from "react-native-toast-notifications";
import { reduceMealData } from "@/shared/mealDataReducer";

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

    const [loggedIn, setLoggedIn] = useState(false);

    const [mealsData, mealsAreLoading, mealsError, fetchMeals] = useApi<
        MealsResponse,
        NoBody
    >("/meals", "GET");
    const [userData, userIsLoading, userError, fetchUser] = useApi<UserData, NoBody>("/user", "GET");
    let [dailySummaryData, setDailySummaryData] = useState<SummaryData | null>(
        null,
    );

    useFocusEffect(useCallback(() => {
        fetchMeals();
    }, []));

    useEffect(() => {
        navigation.setOptions({ title: "Home" });

        fetchUser();
    }, [navigation]);

    useEffect(() => {
        if (userIsLoading) {
            console.log("checking session status...");
        } else if (userData) {
            setLoggedIn(true);
            fetchMeals();
        } else if (userError) {
            console.log("HERE");

            router.push("/login");
        }
        console.log(userData, userError);
    }, [userIsLoading]);

    useEffect(() => {
        if (mealsAreLoading) {
            console.log("loading meals data...");
        } else {
            console.log("loaded meals data!");

            console.log(mealsData);
            console.log(mealsError);

            if (mealsData == null || mealsData == undefined) {
                return;
            }

            let dailySummary = mealsData!.mealList.reduce(
                (pv, item) => {
                    let [fats, carbs, proteins, sugars, other] =
                        reduceMealData(item);

                    pv.calories += item.caloriesPerServing! * item.servings!;
                    pv.fats += fats;
                    pv.protiens += proteins;
                    pv.sugars += sugars;
                    pv.carbs += carbs;
                    pv.other += other;
                    pv.date = item.dateCreated;

                    return pv;
                },
                {
                    calories: 0,
                    fats: 0,
                    protiens: 0,
                    sugars: 0,
                    carbs: 0,
                    other: 0,
                    date: new Date(),
                },
            );

            setDailySummaryData(dailySummary);
        }
    }, [mealsAreLoading]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {dailySummaryData && (
                    <DailySummaryView
                        calories={dailySummaryData.calories}
                        fats={dailySummaryData.fats}
                        proteins={dailySummaryData.protiens}
                        sugars={dailySummaryData.sugars}
                        carbs={dailySummaryData.carbs}
                        other={dailySummaryData.other}
                        day={new Date(dailySummaryData.date)}
                    />
                )}
                <Text
                    style={{
                        color: colorScheme == "light" ? "#aeaeb2" : "#636366",
                        fontSize: 16,
                        fontVariant: ["small-caps"],
                    }}
                >
                    ALL PREVIOUS MEALS
                </Text>
                {mealsData && (
                    <FlatList
                        data={mealsData!.mealList}
                        renderItem={({ item }) => (
                            <MealSummaryView item={item} />
                        )}
                        keyExtractor={(item) => item._id}
                        scrollEnabled={false}
                    />
                )}
            </ScrollView>

            {/* TODO: Make inaccessible while model isn't loaded */}
            <View style={styles.footer}>
                <NavButton
                    screen={"/camerascreen"}
                    text="Take Photo"
                    icon={["far", "circle-user"]}
                    fullWidth={true}
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
        height: 100,
    },
});
