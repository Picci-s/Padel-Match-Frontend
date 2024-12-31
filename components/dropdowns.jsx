import React from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

/* propriétés à renseigner à chaque import :
data = tableau des valeurs possibles => disponibles dans le fichier appDatas
placeholder = texte apparaissant dans le selecteur
value = variableState
onChange = fonction callback onChange(item => setVariableState(item.value)) */
export const DropdownInput = ({ data, placeholder, onChange, value }) => {

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      maxHeight={300}
      labelField="label"
      valueField="value"
      data={data}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    minHeight: 41,
    marginBottom: 20,
    paddingBottom: 0,
    paddingLeft: 5,
    color: "#0028c6",
    fontFamily: "JostRegular",
    fontSize: 16,
    borderBottomWidth: 0.5,
  },

  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    color: "#6A7FB3",
    fontFamily: "JostRegular",
    fontSize: 16,
  },

  selectedTextStyle: {
    color: "#000414",
    fontFamily: "JostRegular",
    fontSize: 16,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});