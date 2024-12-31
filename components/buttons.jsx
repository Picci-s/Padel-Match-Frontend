import React from "react";
import { Button } from 'react-native-elements';
import { StyleSheet, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// bouton de navigation avec la couleur principale du thème
export function NavigateButton({ title, onPress, style, titleStyle, icon }) {
// creation de props afin de les reutiliser dans les différents screens
    return (
        <View style={styles.containerButton}>
            <Button
                title={title}
                onPress={onPress}
                buttonStyle={[styles.navigateButton, style]}
                titleStyle={[styles.navigateText, titleStyle]}
                icon={
                icon && <FontAwesome name={icon} size={20} color="#fcfbf8" style={styles.icon}/>
                }
            />
        </View>
    );
}

// bouton de validation d'une action (par ex compléter un formulaire) avec la couleur secondaire du thème
export function ValidateButton({ title, onPress, style, titleStyle, icon }) {

    return (
        <View style={styles.containerButton}>
            <Button
                title={title}
                onPress={onPress}
                buttonStyle={[styles.validateButton, style]}
                titleStyle={[styles.validateText, titleStyle]}
                icon={
                icon && <FontAwesome name={icon} size={20} color="#000414" style={styles.icon} />
                }            
            />
        </View>
    );
}

// la taille et la disposition du bouton sont déterminées par containerButton
const styles = StyleSheet.create({
  containerButton: {
    margin: 10,
    display: "flex",
    alignItems: "center",
    justifyContent:'center',
    width: "90%",
  },

  navigateButton: {
    backgroundColor: "#0028c6",
    padding: 12,
    borderRadius: 5,
    minWidth: "100%",
  },
  
  navigateText: {
    color: "#fcfbf8",
    fontFamily: "Cambay",
    fontSize: 20,
    fontWeight: 700,
  },

  validateButton: {
    backgroundColor: "#fab600",
    padding: 12,
    borderRadius: 5,
    minWidth: "100%",
  },

  validateText: {
    color: "#0028c6",
    fontFamily: "Cambay",
    fontSize: 20,
    fontWeight: 700,
  },
  
  icon: {
    marginRight: 15,
  },
});
