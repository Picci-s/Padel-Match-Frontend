import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { Link } from "@react-navigation/native";

// importer ci-dessous les composants de Redux
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilClub } from "../reducers/club";

// importer ci-dessous les éléments de style
import { Input } from "../components/inputs.jsx";
import { ValidateButton } from "../components/buttons";
import { clubScreen, linkStyle, screenTitle } from "../components/appStyles.jsx";

// url du serveur backend
import { backend } from '../components/appDatas.jsx';

export default function ClubLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//déclaration du dispatch redux
  const dispatch = useDispatch();
const profilClub = useSelector((state) => state.club.value.profilClub);
//console.log(profilClub)


//----------------------------------------------------------------------------------------------------//

// appel du backend (post) pour la connection
  const handleSignin = () => {
    // Vérifie si tous les champs obligatoires sont remplis
    if (!email || !password) {
      Alert.alert(
        "Champs vacants",
        "Veuillez remplir tous les champs obligatoires."
      );
      return;
    }

    // on envoi des données au serveur via une requête POST
    fetch(`${backend}/clubs/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert(` Bienvenue ${data.data.name}! `);
          navigation.navigate("ClubTabNavigator"); // Redirection après succès
          dispatch(updateProfilClub(data))// Mise à jour du profil club dans Redux
        } else {
          Alert.alert(
            "Erreur",
            data.error || "Une erreur est survenue lors de la connection."
          );
        }
      })
      .catch((error) => {
        //console.error(error);
        Alert.alert("Erreur", "Erreur de connexion au serveur.");
      });
  };

  //----------------------------------------------------------------------------------------------------//

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={clubScreen}>

        <View style={styles.topContainer}>
          <Image
            style={styles.image}
            source={require("../assets/padel-match-logo-v2.png")}
            alt="Logo de l'application Padel Match"
          />
          <Text style={screenTitle}>Connexion club</Text>
        </View>

        <View style={styles.bottomContainer}>
          <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "android" ? 75 : 0}
          style={styles.formCard}
          >
              <Input
                placeholder="Email"
                onChangeText={(value) => setEmail(value)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                placeholder="Mot de passe"
                onChangeText={(value) => setPassword(value)}
                value={password}
                secureTextEntry={true}
                autoCapitalize="none"
              />
              <ValidateButton title="Se connecter" onPress={handleSignin}/>
          </KeyboardAvoidingView>
          
          <Link style={linkStyle} screen="ClubSignUpScreen">
            Créer un compte
          </Link>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    height: "40%",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
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
    height: "60%",
    flexGrow: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  formCard: {
    width: "90%",
    minWidth: "90%",
    minHeight: 250,
    margin: 10,
    padding: 20,
    backgroundColor: "#fcfbf8",
    borderRadius: 15,
  },
});
