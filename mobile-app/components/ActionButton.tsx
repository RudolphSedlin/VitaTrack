import { Text, View, StyleSheet, useColorScheme, Dimensions, TouchableOpacity } from "react-native";
import { Colors } from "../constants/Colors";
import { Href, Link } from "expo-router";
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

type ActionButtonProps = {
  text: string;
  icon: IconProp;
  fullWidth: boolean;
  onPress: () => void;
}

export default function ActionButton(props: ActionButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <Text>
        <TouchableOpacity onPress={props.onPress}>
            <View style={colorScheme == "dark" ? styles.darkButton : styles.lightButton}>
                <View style={{
                flexDirection: "row",
                width: Dimensions.get("window").width,
                justifyContent: "center",
                alignItems: "center"
                }}>
                    <FontAwesomeIcon style={colorScheme == "dark" ? styles.darkText : styles.lightText} icon={props.icon} />
                    <Text style={colorScheme == "dark" ? styles.darkText : styles.lightText}> {props.text}</Text>
                </View>
            </View>
        </TouchableOpacity>
    </Text>
  );
}

const styles = StyleSheet.create({
  lightButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: Colors.light.tabIconSelected,
    justifyContent: "center",
    alignItems: "center",
  },
  darkButton: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: Colors.dark.tabIconSelected,
  },
  lightText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: Colors.light.buttonText,
  },
  darkText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: Colors.dark.buttonText,
  },
})