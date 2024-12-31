import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";

// importer ci-dessous les composants de Redux
import { useSelector } from "react-redux";

// importer ci-dessous les composants
import ClubTournamentCard from "../components/TournamentCards";

// importer ci-dessous les éléments de style
import { clubScreen, screenTitle, subTitle } from "../components/appStyles";
import { NavigateButton } from "../components/buttons";

// importer moment pour formatter les dates
import moment from "moment";

// url du serveur backend
import { backend } from "../components/appDatas";

// ajout de l'objet navigation comme propriété du composant
export default function ClubHomeScreen({ navigation }) {
  // etat pour stocker un tournoi
  const [nextTournaments, setNextTournaments] = useState([]);

  // utilisation du useselector pour verifier le token du club si valide afficher les 3 prochains tournois de la route get
  const profilClub = useSelector((state) => state.club.value.profilClub);
  const clubToken = profilClub?.token;
  const tournament = useSelector((state) => state.club.value.tournament);
  //console.log('voci les infos stocké ', tournament);

  //----------------------------------------------------------------------------------------------------//

  // mis en place d'un useEffect pour récupérer les données des 3 prochains tournois en BDD
  useEffect(() => {
    // récupération les données des 3 prochains tournois en BDD
    fetch(`${backend}/clubs/tournaments/next/${clubToken}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setNextTournaments(data.data);
        } else {
          Alert.alert(
            "Une erreur s'est produite",
            "La liste des prochains tournois n'a pas pu être récupérée"
          );
          return;
        }
      });
  }, [tournament]);

  //----------------------------------------------------------------------------------------------------//

  // afficher les 3 prochains tournois
  const tournaments = nextTournaments.map((data, i) => {
    return (
      <ClubTournamentCard
        key={i}
        category={data.category}
        start_date={moment(data.start_date).format("DD-MM-YYYY")}
        participants={data.participants.length}
        players_number={data.players_number}
        places_restantes={data.players_number - data.participants.length}
      />
    );
  });

  //----------------------------------------------------------------------------------------------------//

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={clubScreen}>
        <View style={styles.header}>
          <View style={styles.sideContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profil Club")}>
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

        <View style={styles.titleContainer}>
          <Text style={screenTitle}>
            Bienvenue {`${profilClub?.data.name}` || ""}
          </Text>
          <Text style={subTitle && styles.subTitle}>Prochains tournois</Text>
        </View>

        <View style={styles.tournamentList}>
          {tournaments.length === 0 ? (
            <Text style={styles.noTournamentText}>Vous avez 0 tournois</Text>
          ) : (
            tournaments
          )}
        </View>

        <View style={styles.buttonContainer}>
          <NavigateButton
            title="Créer un tournoi"
            onPress={() =>
              navigation.navigate("ClubTabNavigator", {
                screen: "Créer un tournoi",
              })
            }
          />
          <NavigateButton
            title="Gérer mes tournois"
            onPress={() =>
              navigation.navigate("ClubTabNavigator", {
                screen: "Gérer mes tournois",
              })
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "90%",
    height: "10%",
    marginTop: "3%",
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

  titleContainer: {
    height: "10%",
  },

  tournamentList: {
    flexGrow: 1,
    height: "45%",
    marginTop: "5%",
    padding: "5%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },

  buttonContainer: {
    flexGrow: 1,
    height: "15%",
    marginBottom: "4%",
  },
  subTitle: {
    paddingBottom: 15,
    fontsFamily: "JostSemiBold",
    fontSize: 20,
    textAlign: "center",
    marginTop: "2%",
  },
  noTournamentText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginTop: 20,
  },
});
