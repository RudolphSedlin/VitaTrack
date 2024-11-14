import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import TensorCamera from "./TensorCamera"; // Assuming TensorCamera is in the same directory
import { useNavigation } from "expo-router";
import { useApi } from "../hooks/useApi";

import { useToast } from "react-native-toast-notifications";

type Json = { [key: string]: any };

function QueryModel(props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("No prediction yet");
    const [prediction, setPrediction] = useState(null);
    const pastPredictions = useRef([]);
    const [pictureTaken, setPictureTaken] = useState(false);
    const picture = useRef("");
    const requestBody = useRef("");
    const isCapturing = useRef(true);
    const forcePicture = useRef(false);
    const toast = useToast();
    const MAX_ROLLING_LENGTH = 3; // # of confident predictions needed
    const navigation = useNavigation();

    const [data, isLoading, error, fetchData] = useApi<Json, string>(
        "/meals/image",
        "POST",
        requestBody,
    );

    const toggleFrameLoop = () => {
        if (loopRunning) {
            toast.show("Frame loop stopped!");
            stopFrameLoop();
        } else {
            toast.show("Frame loop started!");
            startFrameLoop();
        }
        isCapturing.current = !isCapturing.current;
    };

    const pushToRollingArr = (previous: number[], newVal: number) => {
        // Create a new array by spreading the previous values and adding the new one
        let updatedPredictions = [...previous, newVal.toFixed(2)];

        // If the new array exceeds the max length, remove the oldest value
        if (updatedPredictions.length > MAX_ROLLING_LENGTH) {
            updatedPredictions = updatedPredictions.slice(-MAX_ROLLING_LENGTH); // Remove the oldest value
        }

        return updatedPredictions;
    };

    // Check if past X predictions are all food
    const isAllFood = () => {
        if (pastPredictions.current.length === MAX_ROLLING_LENGTH) {
            return pastPredictions.current.reduce(
                (isFood, current) => isFood && current > 0.5,
            );
        } else {
            return false;
        }
    };

    const sendToGPT = async () => {
        console.log("Sending to backend for analysis");
        requestBody.current = JSON.stringify({ image: picture.current });

        await fetchData();

        if (error) {
            toast.show("An error occurred with GPT");
            return;
        }

        if (!isLoading && data) {
            return data;
        }
    };

    // Function to handle new predictions
    const handlePrediction = async (predictions: number[][]) => {
        if (predictions && predictions.length > 0) {
            const prediction = predictions[0]; // Get current predition (is an array in case we want to expand to a non-binary prediction)

            pastPredictions.current = pushToRollingArr(
                pastPredictions.current,
                prediction,
            );

            console.log(pastPredictions.current);

            setMessage(`${prediction}`);

            if (isAllFood() || forcePicture.current) {
                if (!pictureTaken) {
                    const res = await sendToGPT();

                    // TODO: Do stuff with data
                    toast.show("Picture taken");
                    setPictureTaken(true);
                    isCapturing.current = false;
                    forcePicture.current = false;
                    navigation.goBack(); // Exit camera screen
                }
            } else if (prediction > 0.5) {
                setMessage("Possible food detected, need more confidence");
                toast.show("Possible food detected, need more confidence");
            } else {
                setMessage("Not food");
                toast.show("Not food");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tensor Model Prediction</Text>
            {/* TensorCamera component with setPrediction passed as a prop */}
            <TensorCamera
                setPrediction={handlePrediction}
                picture={picture}
                isCapturing={isCapturing}
                forcePicture={forcePicture}
            />
        </View>
    );
}

export default QueryModel;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    message: {
        fontSize: 18,
        marginVertical: 10,
        paddingHorizontal: 10,
        textAlign: "center",
    },
    resetButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 32,
        backgroundColor: "#007bff",
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
