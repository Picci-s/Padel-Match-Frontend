import React, { useState, useEffect } from "react";
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

// importer ci-dessous les composants
import { PlayerTournamentCard } from "../components/TournamentCards";

// importer ci-dessous les éléments de style
import { playerScreen, screenTitle, subTitle } from "../components/appStyles";
import { NavigateButton } from "../components/buttons";

// url du serveur backend
import { backend } from "../components/appDatas";

// importer ci-dessous les composants de Redux
import { useSelector } from "react-redux";

// importer moment pour formatter les dates
import moment from "moment";

// ajout de l'objet navigation comme propriété du composant
export default function PlayerHomeScreen({ navigation }) {
  const [nextTournaments, setNextTournaments] = useState([]);

  // import du reducers player => profil (lecture)
  const profil = useSelector((state) => state.player.value.profil);
  const registerTournament = useSelector(
    (state) => state.player.value.tournament
  );
  const playerToken = profil?.token;

  // mis en place d'un useEffect pour récupérer les données des 3 prochains tournois en BDD
  useEffect(() => {
    fetch(`${backend}/players/tournaments/next/${playerToken}`)
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
  }, [tournaments, registerTournament]); // mis en dependance pour re-render les tournois

  /*---------------------------------------------------------------------------------------------*/

  // afficher les 3 prochains tournois
  const tournaments = nextTournaments.map((data, i) => {
    return (
      <PlayerTournamentCard
        key={i}
        category={data.category}
        start_date={moment(data.start_date).format("DD-MM-YYYY")}
        clubName={data.clubName}
      />
    );
  });

  /*---------------------------------------------------------------------------------------------*/

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={playerScreen}>
        <View style={styles.header}>
          <View style={styles.sideContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profil Joueur")}>
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
                navigation.navigate("PlayerTabNavigator", {
                  screen: "Mes tournois",
                })
              }
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={screenTitle}>
            Bienvenue {`${profil?.data.firstName}` || ""}
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
            title="Trouver un tournoi"
            onPress={() =>
              navigation.navigate("PlayerTabNavigator", {
                screen: "Trouver un tournoi",
              })
            }
          />
          <NavigateButton
            title="Voir mes tournois"
            onPress={() =>
              navigation.navigate("PlayerTabNavigator", {
                screen: "Mes tournois",
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

  titleContainer: {
    height: "10%",
  },

  tournamentList: {
    flexGrow: 1,
    height: "45%",
    marginTop: "7%",
    padding: "5%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },

  buttonContainer: {
    flexGrow: 1,
    height: "15%",
    marginBottom: "10%",
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
