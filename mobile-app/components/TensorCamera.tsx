import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser, faLightbulb as faRegularBulb } from "@fortawesome/free-regular-svg-icons" 
import { faCamera, faXmark, faLightbulb } from "@fortawesome/free-solid-svg-icons" 

library.add(faCircleUser)
library.add(faCamera)
library.add(faXmark)
library.add(faLightbulb)
library.add(faRegularBulb)


export default function TensorCamera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [lightState, setLightState] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
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
      <CameraView enableTorch={lightState} testID="camera-view" style={styles.camera} facing={facing}>
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
          }}>
            <FontAwesomeIcon color="red" size={30} icon={["fas", "xmark"]}/>
          </TouchableOpacity>
      </View>
    </View>

      </CameraView>
    </View>
  );
}

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
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