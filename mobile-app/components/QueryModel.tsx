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
  const handlePrediction = (predictions: number[][]) => {
    console.log(predictions);
    if (predictions && predictions.length > 0) {
      const prediction = predictions[0][0];

      // Check if the highest probability is above 50%
      if (prediction < 0.5) {
        setMessage(`${prediction}`);

        if (!pictureTaken) {
          //TODO: take picture

          toast.show("Picture taken");
          setPictureTaken(true);
        }
      } else {
        setMessage("No food");
        toast.show("No food");
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
