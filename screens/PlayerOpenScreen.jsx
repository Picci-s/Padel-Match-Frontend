import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Link } from '@react-navigation/native';

// importer ci-dessous les éléments de style
import { NavigateButton } from '../components/buttons';
import { playerScreen, screenTitle, linkStyle } from "../components/appStyles";

// ajout de l'objet navigation comme propriété du composant
export default function PlayerOpenScreen({ navigation }) {

  return (
    <SafeAreaView style={playerScreen}>

      <View style={styles.topContainer}>
        <Image
          style={styles.image}
          source={require("../assets/padel-match-logo-v2.png")}
          alt="Logo de l'application Padel Match"
        />
        <Text style={screenTitle}>Accès Joueur</Text>
      </View>

      <View style={styles.bottomContainer}>

        <View style={styles.buttonContainer}>
          <NavigateButton
            title="S'inscrire"
            onPress={() => navigation.navigate('PlayerSignUpScreen')}
            icon="user-plus"
          />
          <NavigateButton
            title="Se connecter"
            onPress={() => navigation.navigate('PlayerLoginScreen')}
            icon="user"
          />
        </View>

        <Link style={linkStyle} screen='ClubOpenScreen'>Vous administrez un club ?</Link>
      </View>

    </SafeAreaView>
  );
}

// definition des différents styles de la page
const styles = StyleSheet.create({
  topContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60%",
    paddingTop: 25,
    paddingBottom: 50,
  },

  image: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
  },

  bottomContainer: {
    width: "100%",
    height: "40%",
    display: "flex",
    flexDirection: "column",
    justifyContent: 'space-between',
    alignItems: "center",
  },
});
  