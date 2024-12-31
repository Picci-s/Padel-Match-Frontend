import React from "react";
// import des component de react native
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

import { Icon } from "react-native-elements";

// importer ci-dessous les composants de Redux
import { useSelector, useDispatch } from "react-redux";

// importer ci-dessous les éléments de style
import { formCard, playerScreen } from "../components/appStyles";
import { NavigateButton, ValidateButton } from "../components/buttons";
import { Input } from "../components/inputs";
import { backend } from "../components/appDatas";

// ajout de l'objet navigation comme propriété du composant
export default function PlayerProfileScreen({ navigation }) {
  // Accéder aux données du joueur depuis le store Redux
  const playerData = useSelector((state) => state.player.value.profil);

  /*---------------------------------------------------------------------------------------------*/

  // Définir l'état pour les valeurs des champs du formulaire
  const firstName = playerData?.data.firstName || "";
  const lastName = playerData?.data.lastName || "";
  const gender = playerData?.data.gender || "";
  const licence = playerData?.data.licence || "";
  const email = playerData?.data.email || "";
  const phone = playerData?.data.phone || "";
  const street = playerData?.data.address.street || "";
  const city = playerData?.data.address.city || "";
  const zipCode = playerData?.data.address.zipCode || "";

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
            // etape 1 on xécute le fetch pour supprimer le compte
            fetch(`${backend}/players/${email}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => {
                // etape 2 on affiche le message approprié en fonction du résultat
                if (data.result) {
                  //console.log(data.result);
                  Alert.alert("Votre compte a bien été supprimé");

                  navigation.navigate("PlayerOpenScreen");
                } else {
                  // on vérifie si erreur
                  //console.log("Erreur retournée :", data.error);

                  Alert.alert("Suppression impossible");
                }
              })
              .catch((error) => {
                // on afficher un message en cas d'erreur réseau
                //console.error(error);
                Alert.alert(
                  "Erreur",
                  "Impossible de supprimer le tournoi en raison d'une erreur réseau."
                );
              });
          },
        },
      ]
    );
  };

  /*---------------------------------------------------------------------------------------------*/

  // fonction pour la deconnexion pour renvoyer à l'accueil
  const handleLogout = () => {
    navigation.navigate("PlayerLoginScreen");
    //dispatch(logout());
  };

  /*---------------------------------------------------------------------------------------------*/

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={playerScreen}>
        <View style={styles.header}>
          <View style={styles.sideContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PlayerTabNavigator", { screen: "Accueil" })
              }>
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
              reverse
              name="bell"
              size={20}
              color="#d6deff"
              reverseColor="#0028c6"
              type="font-awesome"
              onPress={() =>
                navigation.navigate("PlayerTabNavigator", {
                  screen: "Mes tournois",
                })
              }
            />
          </View>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          {/* Section Mes informations */}
          <View style={formCard}>
            <Text style={styles.subTitle}>Mes informations</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nom :</Text>
              <Input
                placeholder="Nom"
                value={lastName || "Non renseigné"}
                editable={false}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Prénom :</Text>
              <Input
                placeholder="Prénom"
                value={firstName || "Non renseigné"}
                editable={false}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Genre :</Text>
              <Input
                placeholder="Genre"
                value={gender || "Non renseigné"}
                editable={false}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Numéro de licence :</Text>
              <Input
                placeholder="Numéro de licence"
                value={licence || "Non renseigné"}
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
    marginBottom: 5,
    marginTop: 6,
    color: "#555",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
