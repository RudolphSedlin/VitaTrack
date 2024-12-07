import { ScrollView, Text, View } from "react-native";
import QueryModel from "../components/QueryModel";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { NoBody } from "@/shared/api_types";

export default function ReportScreen() {
    const navigation = useNavigation();

    const { report, title } = useLocalSearchParams<{ report: string, title: string }>();

    useEffect(() => {
        navigation.setOptions({ headerShown: true, title: title });        
    }, [navigation]);

    const [reportData, reportIsLoading, reportError, fetchReport] = useApi<string, NoBody>(report, "GET");

    useEffect(() => {
        fetchReport();
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10
            }}
        >
            <ScrollView>
                <Text>{reportData ? (title == "Report" ? JSON.stringify(reportData) : reportData) : "Loading report data..."}</Text>
            </ScrollView>
        </View>
    );
}
