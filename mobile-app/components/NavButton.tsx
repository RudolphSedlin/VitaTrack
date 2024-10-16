import { Text, View, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { Href, Link } from "expo-router";
import { useEffect } from "react";

type NavButtonProps = {
  screen: Href; 
  text: string;
}

export default function NavButton(props: NavButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <Link style={colorScheme == "dark" ? styles.darkButton : styles.lightButton} href={props.screen}>
      <Text style={colorScheme == "dark" ? styles.darkText : styles.lightText}>{props.text}</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  lightButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: Colors.light.tabIconSelected,
  },
  darkButton: {
    alignItems: 'center',
    justifyContent: 'center',
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
    color: Colors.light.text,
  },
  darkText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: Colors.dark.text,
  },
})