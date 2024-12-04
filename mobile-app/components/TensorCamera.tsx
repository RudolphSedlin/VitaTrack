import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useNavigation, useLocalSearchParams } from "expo-router";
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
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { useToast } from "react-native-toast-notifications";
import { loadGraphModel } from "@tensorflow/tfjs-converter";
import * as jpeg from "jpeg-js";
import * as ImageManipulator from "expo-image-manipulator";

import modelJSON from "../assets/food_model.json/model.json";
import modelWeights from "../assets/food_model.json/group1.bin";
import { useModel } from "../app/ModelContext";

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
  const cameraRef = useRef<CameraView>(null); // Camera reference
  const toast = useToast();

  const navigation = useNavigation();

  const base64Image = props.picture;
  const setPrediction = props.setPrediction;
  const isCapturing = props.isCapturing;
  const forcePicture = props.forcePicture;
  const model = useModel(); // Load model from context

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
    let prediction = [0, 0, 0];

    if (cameraRef.current) {
      console.log("Camera is open");
      // Capture the frame
      const picture = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.75, // Adjust to balance quality and performance
      });

      console.log(picture);
      if (picture && picture.base64) {
        // Set picture for use in queryModel
        base64Image.current = (await resizeImage(picture.uri, 512, 512)).base64;

        // Don't analyze frame if picture is being forced
        if (!forcePicture.current) {
          console.log("Analyzing photo");
          // Resize image to format supported by the model
          const resized = await resizeImage(picture.uri, 224, 224);

          // Create the tensor from the base64 representation of the image
          const tensor = await base64ImageToTensor(resized.base64);

          // Get the prediction from the model
          prediction = await runModelPrediction(tensor);

          console.log(`Prediction: ${prediction}`);

          // Dispose of tensor to free memory
          tensor.dispose();

          //Navigate to analysis page
          //navigation.navigate("chatgptTest", { imageData: resized.base64 });
        }

        // Use the prediction (e.g., update UI)
        await setPrediction(prediction);
      }
    }
  };

  const startFrameLoop = async () => {
    console.log("Starting camera");
    const processFrame = async () => {
      if (!isCapturing.current || !cameraRef.current) return;

      await captureAndAnalyzeFrame(); // Capture and analyze current frame

      // Run the next frame in the loop
      requestAnimationFrame(processFrame); // Schedule the next frame
    };

    // Start the loop
    requestAnimationFrame(processFrame);
  };

  const stopFrameLoop = () => {
    isCapturing.current = false;
  };

  const forceImage = async () => {
    console.log("Forcing picture");
    stopFrameLoop();

    forcePicture.current = true;

    // Get the image and bypass prediction
    await captureAndAnalyzeFrame();
  };

  const toggleFrameLoop = () => {
    if (isCapturing.current) {
      toast.show("Frame loop stopped!");
      stopFrameLoop();
    } else {
      toast.show("Frame loop started!");
      startFrameLoop();
    }
    isCapturing.current = !isCapturing.current;
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

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlashlight = () => {
    setLightState(!lightState);
  };

  return (
    <View>
      <CameraView
        enableTorch={lightState}
        testID="camera-view"
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        animateShutter={false}
        onCameraReady={startFrameLoop}
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
              onPress={forceImage}
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
