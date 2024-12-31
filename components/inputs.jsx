import React from "react";
import { TextInput, StyleSheet } from "react-native";

export function Input({
  placeholder,
  value,
  onChangeText,
  style,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
}) {

    return (
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, style]}
        placeholderTextColor="#6A7FB3"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
      />
  );
}

// Styles
const styles = StyleSheet.create({
    input: {
        flex: 1,
        minHeight: 41,
        marginBottom: 20,
        paddingBottom: 5,
        color: "#000414",
        fontFamily: "JostRegular",
        fontSize: 16,
        borderBottomWidth: 0.5,
    },
});
