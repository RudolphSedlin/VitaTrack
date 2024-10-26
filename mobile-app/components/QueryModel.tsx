import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import TensorCamera from "./TensorCamera"; // Assuming TensorCamera is in the same directory

import { useToast } from "react-native-toast-notifications";

function QueryModel() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("No prediction yet");
    const [prediction, setPrediction] = useState(null);
    const [pictureTaken, setPictureTaken] = useState(false);
    const toast = useToast();

    // Function to handle new predictions
    const handlePrediction = (predictions: { className: string; probability: number; }[] | undefined) => {
        console.log(predictions);
        if (predictions && predictions.length > 0) {
            const highestProbabilityItem = predictions.reduce((prev, current) => {
                return prev.probability > current.probability ? prev : current;
            });

            // Check if the highest probability is above 50%
            if (highestProbabilityItem.probability > 0.5) {
                setMessage(
                    `${highestProbabilityItem.className}: ${highestProbabilityItem.probability.toFixed(2)}`,
                );

                if (!pictureTaken) {
                    //TODO: take picture

                    toast.show("Picture taken");
                    setPictureTaken(true);
                }
            } else {
                setMessage("No prediction above 50%");
                toast.show("No pred. above 50%");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tensor Model Prediction</Text>
            {/* TensorCamera component with setPrediction passed as a prop */}
            <TensorCamera setPrediction={handlePrediction} />
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
