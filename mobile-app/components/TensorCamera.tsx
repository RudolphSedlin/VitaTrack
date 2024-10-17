import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import * as jpeg from "jpeg-js";
import { Base64 } from "js-base64";

export default function TensorCamera({ setPrediction }) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [model, setModel] = useState(null);
  const cameraRef = useRef(null); // Camera reference
  const isRunning = useRef(false); // Controls loop status

  // Load TensorFlow.js model
  useEffect(() => {
    (async () => {
      await tf.ready(); // Ensure TensorFlow.js is ready
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      console.log("Successfully loaded model");
    })();
  }, []);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const imageToTensor = (imageData) => {
    return new Promise((resolve, reject) => {
      // Create a new Image object
      const img = new Image();

      // Set the source of the image
      img.src = imageData;

      // Handle image loading
      img.onload = () => {
        // Convert the loaded image to a Tensor
        const imageFeatures = tf.tidy(() => {
          const imageAsTensor = tf.browser.fromPixels(img);
          return imageAsTensor;
        });
        resolve(imageFeatures); // Resolve the promise with the tensor
      };

      // Handle image loading errors
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(error); // Reject the promise with the error
      };
    });
  };

  const runModelPrediction = async (imageTensor) => {
    if (model) {
      const prediction = model.classify(imageTensor);
      return prediction;
    }
  };

  const captureAndAnalyzeFrame = async () => {
    if (cameraRef.current) {
      // Capture the frame
      const picture = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5, // Adjust to balance quality and performance
      });

      const tensor = await imageToTensor(picture.base64);
      const prediction = await runModelPrediction(tensor);

      // Use the prediction (e.g., update UI)
      setPrediction(prediction);

      // Dispose of tensor to free memory
      tensor.dispose();
    }
  };

  const startFrameLoop = async () => {
    isRunning.current = true;

    const processFrame = async () => {
      if (!isRunning.current || !cameraRef.current) return;

      await captureAndAnalyzeFrame(); // Capture and analyze current frame

      // Run the next frame in the loop
      requestAnimationFrame(processFrame); // Schedule the next frame
    };

    // Start the loop
    requestAnimationFrame(processFrame);
  };

  const stopFrameLoop = () => {
    isRunning.current = false;
  };

  // Camera permission handling
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={startFrameLoop}>
          <Text style={styles.text}>Start Loop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stopFrameLoop}>
          <Text style={styles.text}>Stop Loop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Center horizontally
  },
  cameraContainer: {
    justifyContent: "center",
    alignItems: "center", // Center camera feed
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    width: width,
    height: height,
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    width: width * 0.75,
  },
});
