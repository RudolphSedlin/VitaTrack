import React, { createContext, useState, useContext, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
import modelJSON from "../assets/food_model.json/model.json";
import modelWeights from "../assets/food_model.json/group1.bin";

const ModelContext = createContext(null);

export const useModel = () => useContext(ModelContext);

export const ModelProvider = ({ children }) => {
    const [model, setModel] = useState(null);

    useEffect(() => {
        const loadModel = async () => {
            await tf.ready();
            try {
                const loadedModel = await tf.loadLayersModel(
                    bundleResourceIO(modelJSON, modelWeights),
                );
                setModel(loadedModel);
                console.log("Model loaded");
            } catch (e) {
                console.error("Error loading model:", e);
            }
        };

        loadModel();
    }, []);

    return (
        <ModelContext.Provider value={model}>{children}</ModelContext.Provider>
    );
};
