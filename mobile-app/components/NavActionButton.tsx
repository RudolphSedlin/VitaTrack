import { Text, View, StyleSheet, useColorScheme, Dimensions, TouchableOpacity } from "react-native";
import { Colors } from "../constants/Colors";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type NavActionButtonProps = {
  text: string;
  icon: IconProp;
  fullWidth: boolean;
  onPress: () => void;
}

export default function NavActionButton(props: NavActionButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={colorScheme == "dark" ? styles.darkButton : styles.lightButton}>
        <View style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <FontAwesomeIcon style={colorScheme == "dark" ? styles.lightText : styles.lightText} icon={props.icon} size={14} />
          <Text style={colorScheme == "dark" ? styles.darkText : styles.lightText}> {props.text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  lightButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: Colors.light.background,
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
    backgroundColor: Colors.dark.background,
  },
  lightText: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: Colors.light.tabIconSelected,
  },
  darkText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: Colors.dark.tabIconSelected,
  },
})