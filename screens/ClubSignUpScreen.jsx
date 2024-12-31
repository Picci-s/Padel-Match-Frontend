import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "@react-navigation/native";

// importer ci-dessous les composants de Redux
import {useDispatch, useSelector} from 'react-redux';
import { updateProfilClub } from "../reducers/club";

// importer ci-dessous les éléments de style
import { Input } from "../components/inputs";
import { clubScreen, formCard, linkStyle, screenTitle, scrollContainer, subTitle, titleTopContainer } from "../components/appStyles";
import { ValidateButton } from "../components/buttons";
import { backend, EMAIL_REGEX} from '../components/appDatas'


// Composant principal pour l'inscription des administrateurs de clubs
export default function ClubSignUpScreen({ navigation }) {
  // États pour stocker les valeurs des champs de saisie
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  //const [bank_id, setBankId] = useState("");
  //const [avatar, setAvatar] = useState("");

  //déclaration du dispatch redux
const dispatch = useDispatch();
//const profilClub = useSelector((state) => state.club.value.profilClub);
//console.log(profilClub)


//----------------------------------------------------------------------------------------------------//


  // Fonction pour gérer l'inscription
  const handleSignUp = () => {
    // Vérifie si tous les champs obligatoires sont remplis
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !city ||
      !zipCode ||
      !street
    ) {
      Alert.alert(
        "Champs vacants",
        "Veuillez remplir tous les champs obligatoires."
      );
      return;
    }
    //check l'email
    if (!EMAIL_REGEX.test(email)) {
      Alert.alert("Email non valide", "Email non valide");
      return;
    }
    // Envoi des données au serveur via une requête POST
    fetch(`${backend}/clubs/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
        city,
        zipCode,
        street,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          Alert.alert(`Inscription réussie, Bienvenue ${data.data.name} !`);
          navigation.navigate("ClubTabNavigator"); // Redirection après succès
          dispatch(updateProfilClub(data))// Mise à jour du profil club dans Redux
        } else {
          Alert.alert(
            "Erreur",
            data.error || "Une erreur est survenue lors de l'inscription."
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
      {/* Permet d'éviter le recouvrement du clavier sur iOS */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={clubScreen}>
        <ScrollView contentContainerStyle={scrollContainer}>
          <View style={titleTopContainer}>
            <Text style={screenTitle}>Inscription</Text>
            <Text style = {subTitle}>Administrateur de Club</Text>
          </View>

          <View style={formCard}>
            <Text style={subTitle}>Profil</Text>
            <Input
              placeholder="Nom du club"
              onChangeText={(value) => setName(value)}
              value={name}
            />
            <Input
              placeholder="Adresse e-mail"
              onChangeText={(value) => setEmail(value)}
              value={email}
              keyboardType="email-address"
            />
            <Input
              placeholder="Mot de passe"
              onChangeText={(value) => setPassword(value)}
              value={password}
              secureTextEntry={true}
            />
        </View>

        <View style={formCard}>
        <Text style={subTitle}>Coordonnées</Text>
          <Input
              placeholder="Téléphone"
              onChangeText={(value) => setPhone(value)}
              value={phone}
              keyboardType="phone-pad"
          />
          <Input
            placeholder="Adresse"
            onChangeText={(value) => setStreet(value)}
            value={street}
          />
          <Input
            placeholder="Code postal"
            onChangeText={(value) => setZipCode(value)}
            value={zipCode}
            keyboardType="numeric"
          />
          <Input
            placeholder="Ville"
            onChangeText={(value) => setCity(value)}
            value={city}
          />
        </View>

          <ValidateButton title="M'inscrire" onPress={handleSignUp} />

          <Link screen="ClubLoginScreen" style={linkStyle}>
            Vous avez déjà un compte ?
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

