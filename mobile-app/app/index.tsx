import { View, StyleSheet, useColorScheme, FlatList, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link, useNavigation } from "expo-router";
import { useEffect } from "react";
import NavButton from "@/components/NavButton";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import MealSummaryView from "@/components/MealSummaryView";

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
        }
    ];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {/** TODO: JIRA-51 */}
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