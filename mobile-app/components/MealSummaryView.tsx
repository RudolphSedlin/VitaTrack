import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, useColorScheme, View } from "react-native"
import { PieChart, pieDataItem } from "react-native-gifted-charts"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MealData } from "@/shared/api_types";

type MealSummaryViewProps = {
    item: MealData;
}

export default function MealSummaryView(props: MealSummaryViewProps) {
    const colorScheme = useColorScheme();
    const item = props.item;

    let fats: number = 0;
    let carbs: number = 0;
    let proteins: number = 0;
    let sugars: number = 0;
    let other: number = 0;

    fats += item.nutrientsPerServing!.fats;

    for (let subcategory in item.nutrientsPerServing!.carbohydrates) {
        if (subcategory == "sugars") {
            sugars += item.nutrientsPerServing!.carbohydrates["sugars"];
            continue;
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

    const netWeight: number = fats + carbs + proteins + sugars + other;
    const data: pieDataItem[] = [
        {
            color: colorScheme == "light" ? "#ff3b30" : "#ff453a",
            value: fats / netWeight
        },
        {
            color: colorScheme == "light" ? "#34c759" : "#2fd158",
            value: carbs / netWeight
        },
        {
            color: colorScheme == "light" ? "#007aff" : "#0984ff",
            value: proteins / netWeight
        },
        {
            color: colorScheme == "light" ? "#aeaeb2" : "#636366",
            value: other / netWeight
        },
        {
            color: colorScheme == "light" ? "#ffcc00" : "#ffd608",
            value: sugars / netWeight
        },
    ];
    
    return (
        <View style={colorScheme == "dark" ? styles.darkView : styles.lightView}>
            <View style={styles.header}>
                <View style={styles.columns}>
                    <Text style={colorScheme == "dark" ? styles.darkTitle : styles.lightTitle}>{item.name}</Text>
                    <Text style={colorScheme == "dark" ? styles.darkLegendText : styles.lightLegendText}>{new Date(item.dateCreated).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</Text>
                </View>
            </View>
            <View style={styles.columns}>
                <View style={{marginTop: 5, marginRight: 5}}>
                    <PieChart
                        data={data}
                        donut
                        innerRadius={30}
                        radius={40}
                        showText
                        innerCircleColor={colorScheme == "dark" ? Colors.dark.background : Colors.light.background}
                        centerLabelComponent={() => <Text style={colorScheme == "dark" ? styles.darkCalorieData : styles.lightCalorieData}>{item.caloriesPerServing! * item.servings!} cal</Text>}
                    />
                </View>
                <View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#ff3b30" : "#ff453a"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>FATS: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{fats}g</Text>
                    </View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#34c759" : "#2fd158"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>CARBS: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{carbs}g</Text>
                    </View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#007aff" : "#0984ff"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>PROTEINS: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{proteins}g</Text>
                    </View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#ffcc00" : "#ffd608"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>SUGARS: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{sugars}g</Text>
                    </View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#aeaeb2" : "#636366"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>OTHER: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{other}g</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    lightLegendText: {
        fontWeight: "bold",
        color: "#aeaeb2",
        fontVariant: ["small-caps"],
        marginLeft: 5
    },
    darkLegendText: {
        fontWeight: "bold",
        color: "#636366",
        fontVariant: ["small-caps"],
        marginLeft: 5
    },
    lightLegendData: {
        fontWeight: "bold",
        color: Colors.light.text,
        fontVariant: ["tabular-nums"],
        marginRight: 5
    },
    darkLegendData: {
        fontWeight: "bold",
        color: Colors.dark.text,
        fontVariant: ["tabular-nums"],
        marginRight: 5
    },
    lightCalorieData: {
        fontWeight: "bold",
        color: Colors.light.text,
        fontVariant: ["tabular-nums"]
    },
    darkCalorieData: {
        fontWeight: "bold",
        color: Colors.dark.text,
        fontVariant: ["tabular-nums"]
    },
    columns: {
        alignSelf: "flex-start",
        flex: 1,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    header: {
        alignSelf: "flex-start",
        flex: 1,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    lightView: {
        backgroundColor: Colors.light.background,
        borderColor: "lightgray",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10
    },
    darkView: {
        backgroundColor: Colors.dark.background,
        borderColor: "lightgray",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10
    },
    lightTitle: {
        fontWeight: "bold",
        fontSize: 18,
        color: Colors.light.text,
    },
    darkTitle: {
        fontWeight: "bold",
        fontSize: 18,
        color: Colors.dark.text,
    },
});