// import des hook
import React, { useEffect, useState } from "react";

// import de components react native
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
  Button,
} from "react-native";

// importer ci-dessous les composants de Redux
import { useSelector } from "react-redux";

// importer ci-dessous les données dec components exportable
import { backend, months } from "../components/appDatas";
import { NavigateButton, ValidateButton } from "../components/buttons";
import { DropdownInput } from "../components/dropdowns";

// import de moment pour le formatage des dates
import moment from "moment";

//import des Icon bibliotheque de react
import { Icon } from "react-native-elements";

// ajout de l'objet navigation comme propriété du composant
export default function PlayerTournamentsScreen({ navigation }) {
  // états des critères de recherche

  const [selectedMonth, setSelectedMonth] = useState(null);

  // etats pour stocker la liste des tournois
  const [tournaments, setTournaments] = useState([]);
  //console.log(tournaments);

  // etat pour gérer l'affichage de la modal (detail du tournoi)
  const [modalVisible, setModalVisible] = useState(false);

  // etat pour stocker le tournoi sélectionné
  const [selectedTournament, setSelectedTournament] = useState(null);

  // import du reducers player => profil (lecture)
  const profil = useSelector((state) => state.player.value.profil);
const registerTournament = useSelector((state) => state.player.value.tournament);

  // variable pour stocker le token du profil player recupere depuis son inscription ou connexion via le store
  const token = profil?.token;
  //console.log("voici mon token", token);

  /*---------------------------------------------------------------------------------------------*/

  useEffect(() => {
    if (!token) {
      Alert.alert("Erreur", "Veuillez vous connecter pour voir les tournois.");
      return;
    }

    fetch(`${backend}/players/tournaments/${token}`)
      .then((response) => {
        //console.log("Réponse brute :", response);
        return response.json();
      })
      .then((data) => {
        //console.log("Données reçues du backend :", data);
        if (data.result) {
          setTournaments(data.data);
        } else {
          setTournaments([]);
          Alert.alert("Aucun tournoi n'a été trouvé.");
        }
      })
      .catch((error) => {
       // console.error("Erreur lors de la récupération des tournois :", error);
        Alert.alert("Erreur", "Impossible de récupérer les tournois.");
      });
  }, [token, registerTournament]); // mis en dependence pour re-render à chaque changement

  /*---------------------------------------------------------------------------------------------*/

  // méthode pour filtrer les tournois par mois sélectionné
  const filteredTournaments = tournaments.filter((t) => {
    // etape 1 on extrait le mois du tournoi au format numérique (0 pour janvier, 11 pour décembre)
    const tournamentMonth = moment(t.start_date).month();
    //console.log("Tournoi mois:", tournamentMonth);
    //console.log("Mois sélectionné:", selectedMonth);

    // etape 2 on vérifie si le mois sélectionné est null (aucun filtre) ou s'il correspond au mois du tournoi
    const monthMatch =
      selectedMonth === null || tournamentMonth === selectedMonth;

    // retourner true si le tournoi correspond au mois sélectionné, false sinon
    return monthMatch;
  });

  // fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedMonth(null);
  };

  /*---------------------------------------------------------------------------------------------*/

  // on map les donnée du back pour afficher le resultat dans les cards
  const tournamentsList = filteredTournaments.map((data, key) => (
    <View key={key} style={styles.tournamentItem}>
      <View style={styles.tournamentInfo}>
        <Text style={styles.tournamentText}>
          <Text style={styles.labelBold1}>Club :</Text> {data.club.name}
        </Text>
        <Text style={styles.tournamentText}>
          <Text style={styles.labelBold}>Catégorie :</Text> {data.category}
        </Text>
        <Text style={styles.tournamentText}>
          <Text style={styles.labelBold}>Date :</Text>{" "}
          {moment(data.start_date).format("DD-MM-YYYY")}
        </Text>
      </View>

      <Icon
        name="eye"
        size={30}
        color="#0028c6"
        type="font-awesome"
        containerStyle={styles.detailIcon}
        onPress={() => {
          setSelectedTournament(data);
          setModalVisible(true);
        }}
      />
    </View>
  ));

  /*---------------------------------------------------------------------------------------------*/

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.titleContainer}>
            <Text style={styles.screenTitle}>Mes tournois</Text>

            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Sélectionnez un mois :</Text>
              <DropdownInput
                data={months}
                placeholder="Sélectionner un mois"
                value={selectedMonth}
                onChange={(item) => setSelectedMonth(item.value)}
              />
            </View>
            <View style={styles.resetButtonContainer}>
              <Button
                title="Réinitialiser les filtres"
                onPress={resetFilters}
                color="#0028c6"
              />
            </View>
          </View>

          <View style={styles.tournamentsListContainer}>
            {tournaments.length === 0 ? (
              <Text style={styles.noTournamentText}>
                0 tournoi pour ces critères
              </Text>
            ) : (
              tournamentsList
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.modalTitle}>Détails du Tournoi</Text>

              {selectedTournament && (
                <>
                  {/* Profil du Club */}
                  <Text style={styles.sectionTitle}>Profil du Club</Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.labelBold1}>Club :</Text>{" "}
                    {selectedTournament.club.name}
                  </Text>

                  <View style={styles.contactRow}>
                    <Icon
                      name="map-marker"
                      type="font-awesome"
                      size={18}
                      color="#0028c6"
                    />
                    <Text style={styles.modalTextInline}>
                      {selectedTournament.club.address?.street},{" "}
                      {selectedTournament.club.address?.city},{" "}
                      {selectedTournament.club.address?.zipCode}
                    </Text>
                  </View>

                  <View style={styles.contactRow}>
                    <Icon
                      name="envelope"
                      type="font-awesome"
                      size={18}
                      color="#0028c6"
                    />
                    <Text style={styles.modalTextInline}>
                      {selectedTournament.club.email}
                    </Text>
                  </View>

                  <View style={styles.contactRow}>
                    <Icon
                      name="phone"
                      type="font-awesome"
                      size={18}
                      color="#0028c6"
                    />
                    <Text style={styles.modalTextInline}>
                      {selectedTournament.club.phone}
                    </Text>
                  </View>

                  {/* Détails du Tournoi */}
                  <Text style={styles.sectionTitle}>Détails du Tournoi</Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.labelBold}>Catégorie :</Text>{" "}
                    {selectedTournament.category}
                  </Text>

                  <Text style={styles.modalText}>
                    <Text style={styles.labelBold}>Date de début :</Text>{" "}
                    {moment(selectedTournament.start_date).format("DD-MM-YYYY")}
                  </Text>

                  <Text style={styles.modalText}>
                    <Text style={styles.labelBold}>Genre :</Text>{" "}
                    {selectedTournament.gender}
                  </Text>

                  <Text style={styles.modalText}>
                    <Text style={styles.labelBold}>Type :</Text>{" "}
                    {selectedTournament.tournamentType}
                  </Text>
                </>
              )}
              <NavigateButton
                title="Fermer"
                onPress={() => setModalVisible(false)}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d6deff",
    padding: 10,
  },
  titleContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: "500",
    color: "#0028c6",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  filterContainer: {
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555555",
    marginBottom: 5,
    textAlign: "left",
  },
  tournamentsListContainer: {
    width: "90%",
    alignSelf: "center",
    paddingBottom: 20,
  },
  noTournamentText: {
    fontSize: 18,
    color: "darkgray",
    textAlign: "center",
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "darkblue",
    marginBottom: 20,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "darkgray",
    marginBottom: 10,
  },
  modalTextInline: {
    fontSize: 16,
    color: "darkgray",
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "darkblue",
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    paddingBottom: 5,
  },
  modalOverlayPicker: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentPicker: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  tournamentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  labelBold1: {
    fontWeight: "bold",
    color: "#0028c6",
    fontSize: 18,
  },
  detailIcon: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#d6deff",
    borderRadius: 50,
  },
  labelBold: {
    fontWeight: "bold",
    color: "black",
  },
  resetButtonContainer: {
    alignSelf: "center",
    marginBottom: 10,
    width: "50%",
  },
  modalTextInline: {
    fontSize: 16,
    color: "darkgray",
    marginLeft: 10,
  },
});
