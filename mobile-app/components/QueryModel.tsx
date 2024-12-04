import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import TensorCamera from "./TensorCamera"; // Assuming TensorCamera is in the same directory
import { useNavigation } from "expo-router";
import { useApi } from "../hooks/useApi";

import { useToast } from "react-native-toast-notifications";

import { MealData } from "../shared/api_types";

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
  const ACCEPTABLE_CONFIDENCE = 0.5;
  const navigation = useNavigation();

  const [data, isLoading, error, fetchData] = useApi<MealData, string>(
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

  const pushToRollingArr = (
    previous: number[],
    newConfidence: number,
    newPrediction: number,
  ) => {
    // Create a new array by spreading the previous values and adding the new one
    let updatedPredictions = [
      ...previous,
      { prediction: newPrediction, confidence: newVal.toFixed(2) },
    ];

    // If the new array exceeds the max length, remove the oldest value
    if (updatedPredictions.length > MAX_ROLLING_LENGTH) {
      updatedPredictions = updatedPredictions.slice(-MAX_ROLLING_LENGTH); // Remove the oldest value
    }

    return updatedPredictions;
  };

  // Check if past X predictions are all food
  const isAllFoodOrDrink = () => {
    if (pastPredictions.current.length === MAX_ROLLING_LENGTH) {
      // Set the accumulator to the first prediction and check to see if all others match AND have an acceptable confidence
      return pastPredictions.current.reduce(
        (seenPred, { prediction, confidence }) =>
          seenPred == prediction && confidence > ACCEPTABLE_CONFIDENCE,
        pastPredictions.current[0].prediction,
      );
    } else {
      return false;
    }
  };

  const sendToGPT = async () => {
    console.log("Sending to backend for analysis");
    requestBody.image = picture.current;

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
    console.log("handling prediction");
    if (predictions && predictions.length > 0) {
      console.log(predictions);
      const confidence = Math.max(...predictions); // Get current best confidence
      const prediction = predictions.indexOf(confidence); // Get the index of prediction to use as model's choice

      pastPredictions.current = pushToRollingArr(
        pastPredictions.current,
        confidence,
        prediction,
      );

      console.log(pastPredictions.current);

      setMessage(`${prediction}`);

      if (isAllFoodOrDrink() || forcePicture.current) {
        if (!pictureTaken) {
          const res = await sendToGPT();
          console.log(JSON.stringify(res));

          // TODO: Do stuff with data
          toast.show("Picture taken");
          setPictureTaken(true);
          isCapturing.current = false;
          forcePicture.current = false;

          try {
            navigation.goBack(); // Exit camera screen
          } catch (error) {
            // Dear error, how about no!
          }
        }
      } else if (prediction < 0.5) {
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
