
import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";

// importer ci-dessous les composants de Redux

import { useSelector, useDispatch } from "react-redux";

// importer ci-dessous les éléments de style
import { NavigateButton, ValidateButton } from "../components/buttons";
import { Input } from "../components/inputs";
import {
  clubScreen,
  formCard,
  scrollContainer,
  buttonContainer,
  titleTopContainer,
  screenTitle,
  subTitle,
} from "../components/appStyles";
import { logout, deleteAccount } from "../reducers/club.js";
import { backend } from "../components/appDatas";

//import de icon 
import { Icon } from "react-native-elements";

// ajout de l'objet navigation comme propriété du composant
export default function ClubProfileScreen({ navigation }) {


  const dispatch = useDispatch();
  // Accéder aux données du joueur depuis le store Redux
  const clubData = useSelector((state) => state.club.value.profilClub);

  /*---------------------------------------------------------------------------------------------*/

  // Définir l'état pour les valeurs des champs du formulaire
  const nameClub = clubData?.data?.name || "";
  const email = clubData?.data.email || "";
  const phone = clubData?.data.phone || "";
  const street = clubData?.data.address.street || "";
  const city = clubData?.data.address.city || "";
  const zipCode = clubData?.data.address.zipCode || "";


  /*---------------------------------------------------------------------------------------------*/


  // connexion au backend pour supprimer le comote (delete)
  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer ce compte?",
      [
        { text: "Annuler", style: "cancel" }, // bouton d'annulation
        {
          text: "Supprimer",
          style: "destructive", // bouton supprimer style 'attention'
          onPress: () => {
            // Étape 1 : exécuter le fetch pour supprimer le club
            fetch(`${backend}/clubs/${email}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => {
                // Étape 2 : Afficher le message approprié en fonction du résultat
                if (data.result) {
                  console.log(data.result);
                  Alert.alert("Votre compte a bien été supprimé");
                  dispatch(deleteAccount());
                  navigation.navigate("ClubOpenScreen");
                } else {
                  console.log("Erreur retournée :", data.error);

                  Alert.alert("Suppression impossible");
                }
              })
              .catch((error) => {
                // Afficher un message en cas d'erreur réseau
                console.error(error);
                Alert.alert(
                  "Erreur",
                  "Impossible de supprimer le club en raison d'une erreur réseau."
                );
              });
          },
        },
      ]
    );
  };

  /*---------------------------------------------------------------------------------------------*/

  // fonction pour se deconnecter renvoi a la page de bienvenue
  const handleLogout = () => {
    navigation.navigate("ClubOpenScreen");
  };


  /*---------------------------------------------------------------------------------------------*/

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Permet d'éviter le recouvrement du clavier sur iOS */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={clubScreen}>
        <View style={styles.header}>
          <View style={styles.sideContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ClubTabNavigator", { screen: "Mon club" })}>
              <Image
                style={styles.avatar}
                source={require("../assets/default-profile-picture.png")}
                alt="Photo de profil"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../assets/padel-match-favicone-v2.png")}
              alt="Logo de l'application"
            />
          </View>
          <View style={styles.sideContainer}>
            <Icon
              reverse={true}
              name="bell"
              size={20}
              color="#d6deff"
              reverseColor="#0028c6"
              type="font-awesome"
              onPress={() =>
                navigation.navigate("ClubTabNavigator", {
                  screen: "Gérer mes tournois",
                })
              }
            />
          </View>

        </View>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={screenTitle}>Mon Profil</Text>
          {/* Section Mes informations */}
          <View style={formCard}>
            <Text style={styles.subTitle}>Mes informations</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nom :</Text>
              <Input
                placeholder="Nom"
                value={nameClub || "Non renseigné"}
                editable={false}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Adresse e-mail :</Text>
              <Input
                placeholder="Adresse e-mail"
                value={email || "Non renseigné"}
                editable={false}
              />
            </View>
          </View>

          {/* Section Coordonnées */}
          <View style={formCard}>
            <Text style={styles.subTitle}>Coordonnées</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Numéro de téléphone :</Text>
              <Input
                placeholder="Numéro de téléphone"
                value={phone || "Non renseigné"}
                editable={false}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Adresse :</Text>
              <Input
                placeholder="Adresse"
                value={street || "Non renseigné"}
                editable={false}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Ville :</Text>
              <Input
                placeholder="Ville"
                value={city || "Non renseigné"}
                editable={false}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Code postal :</Text>
              <Input
                placeholder="Code postal"
                value={zipCode || "Non renseigné"}
                editable={false}
              />
            </View>
          </View>

          <View>
            <NavigateButton title="Me déconnecter" onPress={handleLogout} />
            <ValidateButton
              title="Supprimer mon compte"
              onPress={handleDeleteAccount}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "90%",
    height: "10%",
    marginTop: "5%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  sideContainer: {
    width: "20%",
    height: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  logoContainer: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    display: "flex",
    height: "100%",
    aspectRatio: 1,
    borderRadius: 33,
    borderWidth: 1,
  },

  logo: {
    display: "flex",
    height: "130%",
    aspectRatio: 1,
    padding: 10,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    fontsFamily: "JostSemiBold",
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    //marginBottom: 5,
    color: "#555",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
