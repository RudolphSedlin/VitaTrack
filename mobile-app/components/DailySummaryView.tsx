import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, useColorScheme, View } from "react-native"
import { PieChart, pieDataItem } from "react-native-gifted-charts"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type DailySummaryViewProps = {
    calories: number;
    fats: number;
    proteins: number;
    vitamins: number;
    minerals: number;
    carbs: number;
    other: number;
    day: Date;
}

export default function DailySummaryView(props: DailySummaryViewProps) {
    const colorScheme = useColorScheme();
    const netWeight: number = props.fats + props.carbs + props.proteins + props.vitamins + props.minerals + props.other;
    const data: pieDataItem[] = [
        {
            color: colorScheme == "light" ? "#ff3b30" : "#ff453a",
            value: props.fats / netWeight
        },
        {
            color: colorScheme == "light" ? "#34c759" : "#2fd158",
            value: props.carbs / netWeight
        },
        {
            color: colorScheme == "light" ? "#007aff" : "#0984ff",
            value: props.proteins / netWeight
        },
        {
            color: colorScheme == "light" ? "#aeaeb2" : "#636366",
            value: props.other / netWeight
        },
        {
            color: colorScheme == "light" ? "#ffcc00" : "#ffd608",
            value: props.vitamins / netWeight
        },
        {
            color: colorScheme == "light" ? "#ff00ff" : "#aa00ff",
            value: props.minerals / netWeight
        },
    ];
    
    return (
        <View style={colorScheme == "dark" ? styles.darkView : styles.lightView}>
            <View style={styles.header}>
                <View style={styles.columns}>
                    <Text style={colorScheme == "dark" ? styles.darkTitle : styles.lightTitle}>{props.day.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric'})}</Text>
                    <Text style={colorScheme == "dark" ? styles.darkSubTitle : styles.lightSubTitle}>Daily Overview</Text>
                </View>
            </View>
            <View>
                <View style={{marginTop: 5, marginRight: 5, alignItems: "center", justifyContent: "center"}}>
                    <PieChart
                        data={data}
                        donut
                        innerRadius={50}
                        radius={80}
                        showText
                        innerCircleColor={colorScheme == "dark" ? Colors.dark.background : Colors.light.background}
                        centerLabelComponent={() => <Text style={colorScheme == "dark" ? styles.darkCalorieData : styles.lightCalorieData}>{props.calories} cal</Text>}
                    />
                </View>
                <View>
                    <View style={styles.columns}>
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>TOTALS: </Text>
                    </View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#ff3b30" : "#ff453a"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>FATS: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{props.fats.toFixed(2)}g</Text>
                    </View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#34c759" : "#2fd158"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>CARBS: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{props.carbs.toFixed(2)}g</Text>
                    </View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#007aff" : "#0984ff"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>PROTEINS: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{props.proteins.toFixed(2)}g</Text>
                    </View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#ffcc00" : "#ffd608"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>VITAMINS: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{props.vitamins.toFixed(2)}g</Text>
                    </View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#ff00ff" : "#aa00ff"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>MINERALS: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{props.minerals.toFixed(2)}g</Text>
                    </View>
                    <View style={styles.columns}>
                        <MaterialCommunityIcons name="circle-slice-8" size={16} color={colorScheme == "light" ? "#aeaeb2" : "#636366"} />
                        <Text style={colorScheme == "light" ? styles.lightLegendText : styles.darkLegendText}>OTHER: </Text>
                        <Text style={colorScheme == "light" ? styles.lightLegendData : styles.darkLegendData}>{props.other.toFixed(2)}g</Text>
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
        fontVariant: ["tabular-nums"],
        fontSize: 18
    },
    darkCalorieData: {
        fontWeight: "bold",
        color: Colors.dark.text,
        fontVariant: ["tabular-nums"],
        fontSize: 18
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
        fontSize: 22,
        color: Colors.light.text,
    },
    darkTitle: {
        fontWeight: "bold",
        fontSize: 22,
        color: Colors.dark.text,
    },
    lightSubTitle: {
        fontWeight: "bold",
        fontSize: 22,
        color: "#aeaeb2"
    },
    darkSubTitle: {
        fontWeight: "bold",
        fontSize: 22,
        color: "#636366",
    },
});
