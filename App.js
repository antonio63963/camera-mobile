import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";

export default function App() {
  const [isAudioPermission, setIsAudioPermission] = useState(null);
  const [isCameraPermission, setIsCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [status, setStatus] = useState({});

  const video = React.useRef(null);

  const takeVideo = async () => {
    if (camera) {
      const data = await camera.recordAsync({
        maxDuration: 10,
      });
      setRecord(data.uri);
      console.log("Record data: ", data.uri);
    }
  };

  const stopVideo = async () => camera.stopRecording();

  if (!isCameraPermission || !isAudioPermission) {
    <View>
      <Text>No access to Camera!</Text>
    </View>;
  }

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setIsCameraPermission(cameraStatus.status === "granted");

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setIsAudioPermission(audioStatus.status === "granted");
    })();
    console.log('FX=====:', Camera.Constants)
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.fixedRatio}
            type={type}
            ratio="3:3"
          />
        </View>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: record,
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        <View style={styles.buttons}>
          <Button
            title={status.isPlaying ? "Pause" : "Play"}
            onPress={() =>
              status.isPlaying
                ? video.current.pauseAsync()
                : video.current.playAsync()
            }
          />
        </View>
        <Button
          title="Flip Video"
          onPress={() => {
            console.log('camera: ', camera)
            setType((currentState) =>
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        />
        <Button title="Take Video" onPress={takeVideo} />
        <Button title="Stop Video" onPress={stopVideo} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 220,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
