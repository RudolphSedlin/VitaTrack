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
import * as tf from "@tensorflow/tfjs";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleUser,
  faLightbulb as faRegularBulb,
} from "@fortawesome/free-regular-svg-icons";
import {
  faCamera,
  faXmark,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { Tensor3D } from "@tensorflow/tfjs";
import {
  bundleResourceIO,
  base64ImageToTensor,
} from "@tensorflow/tfjs-react-native";
import { useToast } from "react-native-toast-notifications";
import { loadGraphModel } from "@tensorflow/tfjs-converter";
import * as jpeg from "jpeg-js";
import * as ImageManipulator from "expo-image-manipulator";

const modelJSON = require("../assets/food_model.json/model.json");
const modelWeights = require("../assets/food_model.json/group1.bin");

library.add(faCircleUser);
library.add(faCamera);
library.add(faXmark);
library.add(faLightbulb);
library.add(faRegularBulb);

type TensorCameraProps = {
  setPrediction: (preds: number[][]) => void;
};

export default function TensorCamera(props: TensorCameraProps) {
  const [lightState, setLightState] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [loopRunning, setLoopRunning] = useState(false);
  const cameraRef = useRef<CameraView>(null); // Camera reference
  const isRunning = useRef(false); // Controls loop status
  const toast = useToast();

  const navigation = useNavigation();

  const setPrediction = props.setPrediction;

  // Load TensorFlow.js model
  useEffect(() => {
    (async () => {
      await tf.ready(); // Ensure TensorFlow.js is ready
      try {
        const loadedModel = await tf.loadLayersModel(
          bundleResourceIO(modelJSON, modelWeights),
        );
        setModel(loadedModel);
        console.log("Successfully loaded model");
      } catch (e) {
        console.error("[LOADING ERROR] info:", e);
      }
    })();
  }, []);

  const resizeImage = async (
    imageUrl: string,
    width: number,
    height: number,
  ): Promise<ImageManipulator.ImageResult> => {
    const actions = [
      {
        resize: {
          width,
          height,
        },
      },
    ];
    const saveOptions = {
      compress: 0.75,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    };
    const res = await ImageManipulator.manipulateAsync(
      imageUrl,
      actions,
      saveOptions,
    );
    return res;
  };

  const base64ImageToTensor = async (base64: string): Promise<tf.Tensor4D> => {
    // Decode the base64 image
    const rawImageData = tf.util.encodeString(base64, "base64");
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);

    // Drop the alpha channel info if present
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0; // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4; // Skip the alpha channel
    }

    // Create a 3D tensor from the buffer
    const imageTensor = tf.tensor3d(buffer, [height, width, 3]);

    // Add a batch dimension to create a 4D tensor
    const batchedImageTensor = imageTensor.expandDims(0); // This creates a tensor of shape [1, height, width, 3]

    return batchedImageTensor;
  };

  const runModelPrediction = async (imageTensor: Tensor3D) => {
    if (model) {
      const prediction = await model.predict(imageTensor).data();
      return prediction;
    }
  };

  const captureAndAnalyzeFrame = async () => {
    console.log("test1");
    if (cameraRef.current) {
      // Capture the frame
      const picture = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 1, // Adjust to balance quality and performance
      });

      if (picture && picture.base64) {
        // const tensor = await imageToTensor(picture.base64);
        const resized = await resizeImage(picture.uri, 224, 224);
        const tensor = await base64ImageToTensor(resized.base64);
        const prediction = await runModelPrediction(tensor);

        // Use the prediction (e.g., update UI)
        setPrediction(prediction);
        
        // Dispose of tensor to free memory
        tensor.dispose();
        console.log("sent to gpt");

        //Navigate to analysis page
        navigation.navigate("chatgptTest", { imageData: resized.base64 });
        
      }
    }
  };

  const startFrameLoop = async () => {
    isRunning.current = true;

    const processFrame = async () => {
      if (!isRunning.current || !cameraRef.current) return;

      await captureAndAnalyzeFrame(); // Capture and analyze current frame



      //STOP IMAGES FROM CONSTANTLY BEING TAKEN
      stopFrameLoop()  //REMOVE TO RE-ENABLE AUTO IMAGES
      //STOP IMAGES FROM CONSTANTLY BEING TAKEN

      

      // Run the next frame in the loop
      requestAnimationFrame(processFrame); // Schedule the next frame
    };

    // Start the loop
    requestAnimationFrame(processFrame);
  };

  const stopFrameLoop = () => {
    isRunning.current = false;
  };

  function toggleFrameLoop() {
    if (loopRunning) {
      toast.show("Frame loop stopped!");
      stopFrameLoop();
    } else {
      toast.show("Frame loop started!");
      startFrameLoop();
    }
    setLoopRunning(!loopRunning);
  }

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
      <CameraView
        enableTorch={lightState}
        testID="camera-view"
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row",
            flex: 1,
            width: "100%",
            padding: 20,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignSelf: "center",
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                width: 60,
                height: 60,
                bottom: 50,
                borderRadius: 100,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={toggleFlashlight}
            >
              <FontAwesomeIcon
                size={30}
                icon={lightState ? ["fas", "lightbulb"] : ["far", "lightbulb"]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 90,
                height: 90,
                bottom: 50,
                borderRadius: 100,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={toggleFrameLoop}
            >
              <FontAwesomeIcon size={40} icon={["fas", "camera"]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 60,
                height: 60,
                bottom: 50,
                borderRadius: 100,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={navigation.goBack}
            >
              <FontAwesomeIcon color="red" size={30} icon={["fas", "xmark"]} />
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
    alignItems: "center",
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
