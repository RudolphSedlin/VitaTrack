import { View, StyleSheet, useColorScheme, FlatList, ScrollView, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import NavButton from "@/components/NavButton";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import MealSummaryView from "@/components/MealSummaryView";
import DailySummaryView from "@/components/DailySummaryView";
import { useApi } from "@/hooks/useApi";
import { LoginRequestBody, MealsResponse, NoBody, UserData } from "@/shared/api_types";
import { useToast } from "react-native-toast-notifications";

library.add(faCircleUser)
library.add(faCamera)

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
    const [userData, userIsLoading, userError, fetchUser] = useApi<UserData, LoginRequestBody>("/login", "POST", {
        phoneNumber: "1-800-123-4567",
        password: "GiantMagnet+318"
    });
    const [mealsData, mealsAreLoading, mealsError, fetchMeals] = useApi<MealsResponse, NoBody>("/meals", "GET");
    let [dailySummaryData, setDailySummaryData] = useState<SummaryData | null>(null);

    useEffect(() => {
        navigation.setOptions({ title: "Home" });
        fetchUser();
    }, [navigation]);

    useEffect(() => {
        if (userIsLoading) {
            console.log("loading api data...")
        } else {
            console.log("loaded api data!");

            console.log(userData);
            console.log(userError);

            fetchMeals();
        }
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

            let dailySummary = mealsData!.mealList.reduce((pv, item) => {
                let fats: number = 0;
                let carbs: number = 0;
                let proteins: number = 0;
                let sugars: number = 0;
                let other: number = 0;
        
                fats += item.nutrientsPerServing!.fats;
        
                for (let subcategory in item.nutrientsPerServing!.carbohydrates) {
                    if (subcategory == "sugars") {
                        sugars += item.nutrientsPerServing!.carbohydrates[subcategory];
                    }
                    carbs += item.nutrientsPerServing!.carbohydrates[subcategory];
                }
        
                proteins += item.nutrientsPerServing!.protein;
        
                for (let subcategory in item.nutrientsPerServing!.vitamins) {
                    other += item.nutrientsPerServing!.vitamins[subcategory];
                }
                for (let subcategory in item.nutrientsPerServing!.minerals) {
                    other += item.nutrientsPerServing!.minerals[subcategory];
                }
                for (let subcategory in item.nutrientsPerServing!.other) {
                    other += item.nutrientsPerServing!.other[subcategory];
                }
        
                pv.calories += item.caloriesPerServing! * item.servings!;
                pv.fats += fats;
                pv.protiens += proteins;
                pv.sugars += sugars;
                pv.carbs += carbs;
                pv.other += other;
                pv.date = item.dateCreated;
        
                return pv;
            }, {calories: 0, fats: 0, protiens: 0, sugars: 0, carbs: 0, other: 0, date: new Date()});

            setDailySummaryData(dailySummary);
        }
    }, [mealsAreLoading]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {dailySummaryData && <DailySummaryView 
                    calories={dailySummaryData.calories}
                    fats={dailySummaryData.fats}
                    proteins={dailySummaryData.protiens}
                    sugars={dailySummaryData.sugars}
                    carbs={dailySummaryData.carbs}
                    other={dailySummaryData.other}
                    day={new Date(dailySummaryData.date)}
                />}
                <Text 
                    style={{
                        color: colorScheme == "light" ? "#aeaeb2" : "#636366",
                        fontSize: 16,
                        fontVariant: ["small-caps"]
                    }}
                >
                    ALL PREVIOUS MEALS
                </Text>
                {mealsData && <FlatList
                    data={mealsData!.mealList}
                    renderItem={({item}) => <MealSummaryView item={item} /> }
                    keyExtractor={item => item._id}
                    scrollEnabled={false}
                />}
            </ScrollView>
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