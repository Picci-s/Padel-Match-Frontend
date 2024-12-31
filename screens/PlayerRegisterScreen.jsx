import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";

//import des Icon bibliotheque de react
import { Icon } from "react-native-elements";

//import de checkbox bibliotheque de react (yarn add react-native-check-box)
import CheckBox from "react-native-check-box";

// importer ci-dessous les composants de Redux
import { useDispatch, useSelector } from "react-redux";
import {
  addTournament,
  cancelTournament,
  clearTournamentId,
  clearTournamentCategory,
} from "../reducers/player";

// importer ci-dessous les composants et éléments de style
import { Input } from "../components/inputs";
import { ValidateButton } from "../components/buttons";
import {
  formCard,
  playerScreen,
  scrollContainer,
  linkStyle,
  titleTopContainer,
  screenTitle,
  subTitle,
} from "../components/appStyles";

// importer ci-dessous les données non modifiables du ficher appDatas
import { backend, EMAIL_REGEX, playerGenders } from "../components/appDatas";

import { DropdownInput } from "../components/dropdowns";

// ajout de l'objet navigation comme propriété du composant
export default function PlayerRegisterScreen({ navigation }) {
  // États pour stocker les valeurs des champs de saisie joueur1

  /*----------------------------------Evolution par la suite -----------------------------------------------------------*/
  // const [lastName1, setLastName1] = useState("");
  //const [firstName1, setFirstName1] = useState("");
  //const [licence1, setLicense1] = useState("");
  // const [email1, setEmail1] = useState("");

  /*---------------------------------------------------------------------------------------------*/

  // États pour stocker les valeurs des champs de saisie joueur2
  const [lastName2, setLastName2] = useState("");
  const [firstName2, setFirstName2] = useState("");
  const [licence2, setLicense2] = useState("");
  const [email2, setEmail2] = useState("");
  const [gender2, setGender2] = useState("");

  // pour valider le checkbox lors du click
  const [isSelected, setSelection] = useState(false);

  // import du reducers player => profil (lecture)
  const profil = useSelector((state) => state.player.value.profil);
  const register = useSelector((state) => state.player.value.tournamentId);
  const reducerCategory = useSelector(
    (state) => state.player.value.tournamentCategory
  );

  //console.log('voici mon register', register.tournamentId)

  // variable pour stocker le token du profil player recupere depuis son inscription ou connexion via le store
  const token = profil?.token;
  //console.log("voici mon token", token);

  const selectedTournamentId = register;
  console.log("ID du tournoi sélectionné :", selectedTournamentId);

  const dispatch = useDispatch();

  /*---------------------------------------------------------------------------------------------*/

  // declaration de variable pour afficher les données joueur 1 en dur
  const lastName1 = profil?.data?.lastName || "";
  const firstName1 = profil?.data?.firstName || "";
  const licence1 = profil?.data?.licence || "";
  const email1 = profil?.data?.email || "";
  const gender1 = profil?.data?.gender || "";

  /*---------------------------------------------------------------------------------------------*/

  // methode pour clear l'id + category (titre) lors du retour + renvoi au screen recherche de tournoi
  const handleCancelTournament = () => {
    dispatch(clearTournamentId());
    dispatch(clearTournamentCategory());
    navigation.navigate("Chercher un tournoi");
  };

  /*---------------------------------------------------------------------------------------------*/

  // mis en place de la route put pour inscire les deux joueurs au tournois sélectionné
  const handleUpdateTournament = () => {
    if (!selectedTournamentId) {
      Alert.alert(
        "Erreur",
        "Veuillez sélectionner un tournoi avant de vous inscrire."
      );
      return;
    }

    // Vérification des champs pour le joueur 2
    if (!lastName2 || !firstName2 || !licence2 || !email2) {
      Alert.alert(
        "Erreur",
        "Veuillez remplir tous les champs pour le Joueur 2."
      );
      return;
    }

    if (!EMAIL_REGEX.test(email2)) {
      Alert.alert(
        "Erreur",
        "Veuillez saisir une adresse e-mail valide pour le Joueur 2."
      );
      return;
    }

    fetch(`${backend}/players/register/${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tournamentId: selectedTournamentId,
        partnerFirstName: firstName2,
        partnerLastName: lastName2,
        partnerGender: gender2,
        partnerLicence: licence2,
        partnerEmail: email2,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse du serveur :", data);
        if (data.result) {
          Alert.alert(
            "Inscription réussie",
            "Vous allez être redirigé vers l'accueil.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("Chercher un tournoi"),
              },
            ]
          );
          dispatch(clearTournamentId()); // clear l'id si succes
          dispatch(clearTournamentCategory()); // clear la category dasn le titre si succes
          dispatch(addTournament());
        } else {
          Alert.alert("Erreur", data.error || "Une erreur est survenue.");
        }
      })
      .catch((error) => {
        console.log("Erreur :", error);
        Alert.alert("Erreur", "Impossible de mettre à jour le tournoi.");
      });
  };

  /*-------------------------------------------HEADER--------------------------------------------------*/

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Permet d'éviter le recouvrement du clavier sur iOS */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={playerScreen}>
        <ScrollView contentContainerStyle={scrollContainer}>
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={handleCancelTournament}>
              <Text style={styles.linkStyle}>Retour</Text>
            </TouchableOpacity>
          </View>

          <View style={titleTopContainer}>
            <Text style={screenTitle}>
              {`Inscription au tournoi ${reducerCategory}`}
            </Text>
          </View>

          {/*----------------------------------------------CODE POUR JOUEUR 1------------------------------------------------------*/}

          <View style={formCard}>
            <Text style={subTitle}>Inscription Joueur 1</Text>

            <Input placeholder="Nom" value={lastName1} editable={false} />
            <Input placeholder="Prénom" value={firstName1} editable={false} />
            <Input placeholder="Genre" value={gender1} editable={false} />

            <Input
              placeholder="Numéro de licence"
              value={licence1}
              editable={false}
            />
            <Input
              placeholder="Adresse e-mail"
              value={email1}
              keyboardType="email-address"
              editable={false}
            />
          </View>

          {/*----------------------------------------------CODE POUR JOUEUR 2------------------------------------------------------*/}

          <View style={formCard}>
            <Text style={subTitle}>Inscription Joueur 2</Text>

            <Input
              placeholder="Nom"
              onChangeText={(value) => setLastName2(value)}
              value={lastName2}
            />
            <Input
              placeholder="Prénom"
              onChangeText={(value) => setFirstName2(value)}
              value={firstName2}
            />
            <DropdownInput
              data={playerGenders}
              placeholder="Catégorie"
              value={gender2}
              onChange={(item) => setGender2(item.value)}
            />

            <Input
              placeholder="Numéro de licence"
              onChangeText={(value) => setLicense2(value)}
              value={licence2}
            />
            <Input
              placeholder="Adresse e-mail"
              onChangeText={(value) => setEmail2(value)}
              value={email2}
              keyboardType="email-address"
            />
          </View>
          <View>
            <View style={styles.borderTop}></View>

            {/*----------------------------------------------FOOTER------------------------------------------------------*/}
            <View style={styles.subTitleContainer}>
              <Text style={subTitle}>
                Veuillez choisir votre moyen de paiement
              </Text>
              <Icon
                name="arrow-down"
                size={35}
                color="darkgray"
                type="font-awesome"
                onPress={() => console.log("click")}
              //containerStyle={styles.iconContainer}
              />
            </View>
          </View>
          <View style={styles.icons}>
            <Icon
              name="credit-card"
              size={50}
              color="brown"
              type="font-awesome"
              onPress={() => console.log("click")}
            //containerStyle={styles.iconContainer}
            />
            <Icon
              name="paypal"
              size={50}
              color="#003087"
              //reverseColor="white"
              type="font-awesome"
              onPress={() => console.log("click")}
            //containerStyle={styles.iconContainer}
            />
          </View>

          <ValidateButton
            title="Valider"
            onPress={() => {
              handleUpdateTournament();
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/*---------------------------------------------------------------------------------------------*/

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "flex-start",
  },
  checkbox: {
    alignSelf: "center",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 100,
    //marginTop: 10,
    marginBottom: 50,
    marginTop: 50,
  },
  //iconContainer: {
  //borderRadius: 50,
  //},

  borderTop: {
    borderTopWidth: 1,
    borderTopColor: "#0028c6",
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 10,
  },
  label: {
    margin: 8,
    color: "#0028c6",
  },
  backContainer: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
  },
  linkStyle: {
    fontSize: 16,
    color: "#0028c6",
    textDecorationLine: "underline",
    paddingVertical: 5,
  },
  subTitleContainer: {
    borderRadius: "40%",
  },
});
