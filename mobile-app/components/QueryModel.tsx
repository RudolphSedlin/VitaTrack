import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";
//import * as mobilenet from "@tensorflow-models/mobilenet";
import { cameraWithTensors } from "./TensorCamera.tsx";

// const modelJSON = require("./path/to/jsonfile/model.json");
// const modelWeights = require("./path/to/weightsfile/group1-shard.bin");

// TODO: Replace with my own component since this is outdated.
// Look at source code for tf-react-native and replicate it but better
const TensorCamera = cameraWithTensors(CameraView);

function QueryModel() {
  const [hasPermission, setHasPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [model, setModel] = useState(null);
  const camRef = useRef(null);

  const ms = 100; // Delay between model scans in ms

  // Load model on view render
  useEffect(() => {
    (async () => {
      // Load TensorFlow.js model
      // const model = await tf
      //   .loadLayersModel(bundleResourceIO(modelJSON, modelWeights))
      //   .catch((e) => {
      //     console.log("[LOADING ERROR] info:", e);
      //   });

      // TEST: For use until we get a working model
      //const model = await mobilenet.load();

      if (model) {
        setModel(model);
        console.log("Successfully loaded model");
      }
    })();
  }, []);

  // Make prediction from camera feed
  const handleCameraStream = async (images, updatePreview, gl) => {
    const loop = async () => {
      const nextImageTensor = images.next().value;

      if (nextImageTensor && model) {
        // Make a prediction on the camera stream image tensor
        const prediction = await model.classify(nextImageTensor);
        let resultdict = {};
        prediction.array().then((predArray) => {
          resultdict = { label: "Label", prob: predArray[0][0] };
          setMessage(`${resultdict.label} - ${resultdict.prob}`);
        });

        // Dispose the tensor to free up memory
        nextImageTensor.dispose();
      }
      requestAnimationFrame(loop);
    };
    loop();
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!loading ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.buttonText}>Start Camera</Text>
        </TouchableOpacity>
      ) : (
        <>
          <CameraView facing={"back"} />
          {/* <TensorCamera */}
          {/*   ref={camRef} */}
          {/*   style={styles.camera} */}
          {/*   type={"back"} */}
          {/*   onReady={handleCameraStream} */}
          {/*   autorender={true} */}
          {/*   useCustomShadersToRender={true} */}
          {/* /> */}
          {message && <Text style={styles.predictionText}>{message}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "70%",
  },
  startButton: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  predictionText: {
    marginTop: 20,
    fontSize: 18,
    color: "white",
  },
});

export default QueryModel;
