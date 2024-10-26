import { View, StyleSheet, useColorScheme, FlatList, ScrollView, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link, useNavigation } from "expo-router";
import { useEffect } from "react";
import NavButton from "@/components/NavButton";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import MealSummaryView from "@/components/MealSummaryView";
import DailySummaryView from "@/components/DailySummaryView";

library.add(faCircleUser)
library.add(faCamera)

export default function Index() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: "Home" });
    }, [navigation]);

    const meals = [
        {
            id: "1",
            title: "Chicken Pot Pie",
            calories: 390,
            fats: 23,
            protiens: 15,
            sugars: 3,
            carbs: 31,
            other: 2.41,
            date: new Date()
        },
        {
            id: "2",
            title: "Pork Tenderloin",
            calories: 250,
            fats: 13,
            protiens: 25,
            sugars: 3,
            carbs: 31,
            other: 2.41,
            date: new Date()
        },
        {
            id: "3",
            title: "Ice Cream",
            calories: 170,
            fats: 9,
            protiens: 3,
            sugars: 19,
            carbs: 19,
            other: 0.75,
            date: new Date()
        },
    ];

    const dailySummary = meals.reduce((pv, cv) => {
        pv.calories += cv.calories;
        pv.fats += cv.fats;
        pv.protiens += cv.protiens;
        pv.sugars += cv.sugars;
        pv.carbs += cv.carbs;
        pv.other += cv.other;
        pv.date = cv.date;

        return pv;
    }, {calories: 0, fats: 0, protiens: 0, sugars: 0, carbs: 0, other: 0, date: new Date()});

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <DailySummaryView 
                    calories={dailySummary.calories}
                    fats={dailySummary.fats}
                    protiens={dailySummary.protiens}
                    sugars={dailySummary.sugars}
                    carbs={dailySummary.carbs}
                    other={dailySummary.other}
                    day={dailySummary.date}
                />
                <Text 
                    style={{
                        color: colorScheme == "light" ? "#aeaeb2" : "#636366",
                        fontSize: 16,
                        fontVariant: ["small-caps"]
                    }}
                >
                    all previous meals
                </Text>
                <FlatList
                    data={meals}
                    renderItem={({item}) => <MealSummaryView
                        title={item.title}
                        calories={item.calories}
                        fats={item.fats}
                        protiens={item.protiens} 
                        sugars={item.sugars}
                        carbs={item.carbs} 
                        other={item.other}
                        date={item.date} />
                    }
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                />
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