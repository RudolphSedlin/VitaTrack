import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useNavigation } from "expo-router";
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

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser, faLightbulb as faRegularBulb } from "@fortawesome/free-regular-svg-icons" 
import { faCamera, faXmark, faLightbulb } from "@fortawesome/free-solid-svg-icons" 
import { Tensor3D } from "@tensorflow/tfjs";

library.add(faCircleUser)
library.add(faCamera)
library.add(faXmark)
library.add(faLightbulb)
library.add(faRegularBulb)

type TensorCameraProps = {
  setPrediction: (preds: {
    className: string;
    probability: number;
  }[] | undefined)=>void
}

export default function TensorCamera(props: TensorCameraProps) {
  const [lightState, setLightState] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const cameraRef = useRef<CameraView>(null); // Camera reference
  const isRunning = useRef(false); // Controls loop status

  const navigation = useNavigation();

  const setPrediction = props.setPrediction;

  // Load TensorFlow.js model
  useEffect(() => {
    (async () => {
      await tf.ready(); // Ensure TensorFlow.js is ready
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
      console.log("Successfully loaded model");
    })();
  }, []);

  const imageToTensor = (imageData: string): Promise<tf.Tensor3D> => {
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

  const runModelPrediction = async (imageTensor: Tensor3D) => {
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
      
      if (picture && picture.base64) {
        const tensor = await imageToTensor(picture.base64);
        const prediction = await runModelPrediction(tensor);

        // Use the prediction (e.g., update UI)
        setPrediction(prediction);

        // Dispose of tensor to free memory
        tensor.dispose();
      }
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

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlashlight() {
    setLightState(!lightState);
  }

  return (
    <View>
      <CameraView enableTorch={lightState} testID="camera-view" style={styles.camera} facing={facing} ref={cameraRef}>
      <View style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          flex: 1,
          width: '100%',
          padding: 20,
          justifyContent: 'space-between'
        }}>
        <View style={{
          alignSelf: 'center',
          flex: 1,
          alignItems: 'center',
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
          <TouchableOpacity style={{
            width: 60,
            height: 60,
            bottom: 50,
            borderRadius: 100,
            backgroundColor: '#fff',
            alignItems: "center",
            justifyContent: "center",
          }} onPress={toggleFlashlight}>
            <FontAwesomeIcon size={30} icon={lightState ? ["fas", "lightbulb"] : ["far", "lightbulb"]} />
          </TouchableOpacity>

          <TouchableOpacity style={{
            width: 90,
            height: 90,
            bottom: 50,
            borderRadius: 100,
            backgroundColor: '#fff',
            alignItems: "center",
            justifyContent: "center",
          }}>
            <FontAwesomeIcon size={40} icon={["fas", "camera"]}/>
          </TouchableOpacity>

          <TouchableOpacity style={{
            width: 60,
            height: 60,
            bottom: 50,
            borderRadius: 100,
            backgroundColor: '#fff',
            alignItems: "center",
            justifyContent: "center",
          }} onPress={navigation.goBack}>
            <FontAwesomeIcon color="red" size={30} icon={["fas", "xmark"]}/>
          </TouchableOpacity>
      </View>
    </View>

      </CameraView>
    </View>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    width: width,
    height: height,
    borderRadius: 10,
    zIndex: 0,
    elevation: 0,
  },
});