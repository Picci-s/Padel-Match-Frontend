import React, { useState, useEffect } from "react";
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
  Modal,
} from "react-native";

// import des composants Redux pour récupérer les données depuis le store
import { useSelector, useDispatch } from "react-redux";
import { deleteTournament } from "../reducers/club";

// import des éléments de style personnalisés
import { subTitle } from "../components/appStyles";

// import des composants réutilisables
import { Input } from "../components/inputs";
import { DropdownInput } from "../components/dropdowns";
import { NavigateButton, ValidateButton } from "../components/buttons";
import {
  tournamentGenders,
  tournamentLevel,
  tournamentSchedule,
  tournamentCapacity,
  backend,
} from "../components/appDatas";

// import de moment pour le formatage des dates
import moment from "moment";

// import de datpicker pour afficher un calendrier de selection de date lors de la modification de tournoi
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ClubTournamentsScreen({ navigation }) {
  // etats pour stocker la liste des tournois
  const [tournaments, setTournaments] = useState([]);

  // etat pour basculer entre le mode lecture et édition
  const [isReading, setIsReading] = useState(false);

  // etat pour gérer l'affichage de la modal
  const [modalVisible, setModalVisible] = useState(false);

  // etat pour stocker le tournoi sélectionné
  const [selectedTournament, setSelectedTournament] = useState(null);

  // etats pour les champs modifiables
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [updatedStartDate, setUpdatedStartDate] = useState(new Date());
  const [updatedEndDate, setUpdatedEndDate] = useState(new Date());
  const [updatedTournamentType, setUpdatedTournamentType] = useState("");
  const [updatedGender, setUpdatedGender] = useState("");
  const [updatedPlayersNumber, setUpdatedPlayersNumber] = useState("");
  const [updatedFee, setUpdatedFee] = useState("");

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // récupération des données du club depuis le store Redux
  const profilClub = useSelector((state) => state.club.value.profilClub);
  const clubToken = profilClub?.token;
  //console.log("le token stockée est ", clubToken);
  const tournament = useSelector((state) => state.club.value.tournament);
  const dispatch = useDispatch();

  /*---------------------------------------------------------------------------------------------*/

  // récupérer les tournois depuis le backend lorsque le composant est monté
  useEffect(() => {
    if (!clubToken) {
      Alert.alert("Erreur", "ID du club introuvable.");
      return;
    }

    fetch(`${backend}/clubs/tournaments/${clubToken}`)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data.data); // pour vérifier les données reçues
        if (data.result) {
          setTournaments(data.data); // envoi des données à l'état
        } else {
          Alert.alert("Erreur", "Aucun tournoi trouvé.");
        }
      })
      .catch((error) => {
        //console.log(error); // pour vérifier les erreurs
        Alert.alert("Erreur", "Impossible de récupérer les tournois.");
      });
  }, [clubToken, selectedTournament, tournament]);

  /*---------------------------------------------------------------------------------------------*/

  // configuration de la modal
  const openModal = (tournament) => {
    //console.log(tournament);
    setSelectedTournament(tournament);
    setUpdatedCategory(tournament.category);
    setUpdatedStartDate(moment(tournament.start_date).toDate());
    setUpdatedEndDate(moment(tournament.end_date).toDate());
    setUpdatedTournamentType(tournament.tournamentType);
    setUpdatedGender(tournament.gender);
    setUpdatedPlayersNumber(tournament.players_number.toString());
    setUpdatedFee(tournament.registration_fee.toString());
    setModalVisible(true);
    setIsReading(false); // mode lecture par défaut
  };

  /*---------------------------------------------------------------------------------------------*/

  //console.log("updatedCategory:", updatedCategory);
  //console.log("updatedTournamentType:", updatedTournamentType);
  //console.log("updatedGender:", updatedGender);
  //console.log("updatedPlayersNumber:", updatedPlayersNumber);
  // Fonction pour mettre à jour le tournoi
  const handleUpdateTournament = () => {
    fetch(`${backend}/tournaments/update/${selectedTournament._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: updatedCategory,
        start_date: moment(updatedStartDate).format("YYYY-MM-DD"),
        end_date: moment(updatedEndDate).format("YYYY-MM-DD"),
        tournamentType: updatedTournamentType,
        gender: updatedGender,
        players_number: Number(updatedPlayersNumber),
        registration_fee: Number(updatedFee),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert("Succès", "Tournoi mis à jour avec succès !");
        // ferme la modal
        setModalVisible(false);
        // actualiser la liste des tournois
        setTournaments((updatedTournaments) =>
          updatedTournaments.map((tournament) => {
            if (tournament._id === selectedTournament._id) {
          
             // console.log("tournois: ", tournaments);
              /*console.log("Données envoyées à la route PUT :", {
                category: updatedCategory,
                start_date: moment(updatedStartDate).format("YYYY-MM-DD"),
                end_date: moment(updatedEndDate).format("YYYY-MM-DD"),
                tournamentType: updatedTournamentType,
                gender: updatedGender,
                players_number: Number(updatedPlayersNumber),
                registration_fee: Number(updatedFee),
              });*/

              return {
                ...tournament,
                category: updatedCategory,
                start_date: moment(updatedStartDate).format("YYYY-MM-DD"),
                end_date: moment(updatedEndDate).format("YYYY-MM-DD"),
                tournamentType: updatedTournamentType,
                gender: updatedGender,
                players_number: Number(updatedPlayersNumber),
                registration_fee: Number(updatedFee),
              };
            } else {
              return tournament; //  retourne le tournoi si id n'est pas reconnu
            }
          })
        );
      })
      .catch((error) => {
        //console.log("Erreur :", error);
        Alert.alert("Erreur", "Impossible de mettre à jour le tournoi.");
      });
  };

  /*---------------------------------------------------------------------------------------------*/

  //fonction pour supprimer un tournoi
  const handleDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer ce tournoi ?",
      [
        { text: "Annuler", style: "cancel" }, // bouton d'annulation
        {
          text: "Supprimer",
          style: "destructive", // bouton supprimer style 'attention'
          onPress: () => {
            // eatpe on exécute le fetch pour supprimer le tournoi
            fetch(`${backend}/tournaments/delete/${selectedTournament._id}`, {
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
                  Alert.alert("Succès", "Tournoi supprimé avec succès");
                  setModalVisible(false);
                  dispatch(deleteTournament(selectedTournament._id));
                  //console.log(selectedTournament);
                } else {
                  // on vérifie si l'erreur concerne des participants inscrits
                  //console.log("Erreur retournée :", data.error);
                  if (data.error && data.error.includes("joueurs")) {
                    Alert.alert(
                      "Suppression impossible",
                      "Ce tournoi ne peut pas être supprimé car des participants y sont inscrits."
                    );
                  } else {
                    Alert.alert(
                      "Erreur",
                      "Erreur lors de la suppression du tournoi."
                    );
                  }
                }
              })
              .catch((error) => {
                // on affiche un message en cas d'erreur réseau
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

  // bouton qui active la modification
  const startEditing = () => {
    setIsReading(true);
  };

  const handleStartDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const today = moment().startOf("day").toDate();
      const newStartDate = moment(selectedDate).startOf("day").toDate();

      if (newStartDate >= today) {
        setUpdatedStartDate(newStartDate);

        // ajuste automatiquement la date de fin si elle est antérieure à la nouvelle date de début
        if (updatedEndDate < newStartDate) {
          setUpdatedEndDate(newStartDate);
        }
      } else {
        Alert.alert(
          "Erreur",
          "La date de début ne peut pas être antérieure à aujourd'hui."
        );
      }
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const today = moment().startOf("day").toDate();
      const newEndDate = moment(selectedDate).startOf("day").toDate();

      if (newEndDate >= updatedStartDate && newEndDate >= today) {
        setUpdatedEndDate(newEndDate);
      } else {
        Alert.alert(
          "Erreur",
          "La date de fin ne peut pas être antérieure à la date de début ou à aujourd'hui."
        );
      }
    }
  };

  //switch/case pour chaque category avec couleur
  const getCategoryColor = (category) => {
    switch (category) {
      case "P25":
        return "green";
      case "P100":
        return "blue";
      case "P250":
        return "red";
      case "P500":
        return "purple";
      case "P1000":
        return "orange";
      case "P1500":
        return "pink";
      case "P2000":
        return "brown";
      default:
        return "gray";
    }
  };

  /*---------------------------------------------------------------------------------------------*/

  // affichage de la liste des tournois
  const tournamentsList = tournaments.map((tournament) => (
    <TouchableOpacity
      key={tournament._id}
      onPress={() => openModal(tournament)}
      activeOpacity={0.8}>
      <View style={styles.formCard}>
        <View style={styles.tournamentList}>
          <Text
            style={[
              styles.tournamentCategory,
              { color: getCategoryColor(tournament.category) },
            ]}>
            {tournament.category}
          </Text>
          <Text style={styles.tournamentText}>
            <Text style={styles.tournamentHighlight}>Date de début :</Text>{" "}
            {moment(tournament.start_date).format("DD/MM/YYYY")}
          </Text>
          <Text style={styles.tournamentText}>
            <Text style={styles.tournamentHighlight}>Date de fin :</Text>{" "}
            {moment(tournament.end_date).format("DD/MM/YYYY")}
          </Text>
          <Text style={styles.tournamentText}>
            <Text style={styles.tournamentHighlight}>Genre :</Text>{" "}
            {tournament.gender}
          </Text>
          <Text style={styles.tournamentText}>
            <Text style={styles.tournamentHighlight}>
              Nombre de places restantes :
            </Text>{" "}
            {tournament.players_number - tournament.participants.length}
          </Text>
          <Text style={styles.tournamentText}>
            <Text style={styles.tournamentHighlight}>
              Frais d'inscription :
            </Text>{" "}
            {tournament.registration_fee} €
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ));

  /*---------------------------------------------------------------------------------------------*/

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.screenTitle}>Club</Text>
            <Text style={subTitle}>Gestion des tournois</Text>
            <Text style={styles.tournamentCount}>
              Nbr de tournois : {tournaments.length}
            </Text>
            <View style={styles.separator} />
          </View>
          <View style={styles.tournamentsListContainer}>
            {tournaments.length === 0 ? (
              <Text style={styles.noTournamentText}>
                Vous avez 0 tournoi sur ce mois-ci
              </Text>
            ) : (
              tournamentsList
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal pour afficher et modifier les détails du tournoi */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.modalTitle}>Détails du Tournoi</Text>

              {/*----------------------------------------------------------------------------------------------------*/}

              {!isReading ? (
                <>
                  <Text style={styles.modalText}>
                    Catégorie : {updatedCategory}
                  </Text>
                  <Text style={styles.modalText}>
                    Date de début :{" "}
                    {moment(updatedStartDate).format("DD-MM-YYYY")}
                  </Text>
                  <Text style={styles.modalText}>
                    Date de fin : {moment(updatedEndDate).format("DD-MM-YYYY")}
                  </Text>
                  <Text style={styles.modalText}>
                    Type : {updatedTournamentType}
                  </Text>
                  <Text style={styles.modalText}>Genre : {updatedGender}</Text>
                  <Text style={styles.modalText}>
                    Nombre de joueurs : {updatedPlayersNumber}
                  </Text>
                  <Text style={styles.modalText}>
                    Frais d'inscription : {updatedFee} €
                  </Text>
                  <ValidateButton title="Modifier" onPress={startEditing} />
                </>
              ) : (
                <>
                  <Text style={styles.Text}>Catégorie :</Text>
                  <DropdownInput
                    data={tournamentLevel}
                    placeholder={updatedCategory}
                    value={updatedCategory}
                    onChange={(item) => setUpdatedCategory(item.value)}
                    style={styles.dropdown}
                  />

                  <View style={styles.datePickerContainer}>
                    <Text style={styles.Text}>Date de début :</Text>
                    <TouchableOpacity
                      onPress={() => setShowStartDatePicker(true)}>
                      <Text style={styles.dateText}>
                        {moment(updatedStartDate).format("DD-MM-YYYY")}
                      </Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                      <DateTimePicker
                        value={updatedStartDate}
                        mode="date"
                        display="default"
                        minimumDate={moment().startOf("day").toDate()}
                        maximumDate={updatedEndDate || new Date(2090, 0, 1)}
                        onChange={(event, selectedDate) => {
                          setShowStartDatePicker(false); // ferme le DateTimePicker
                          if (selectedDate) {
                            handleStartDateChange(event, selectedDate);
                          }
                        }}
                      />
                    )}
                  </View>

                  <View style={styles.datePickerContainer}>
                    <Text style={styles.Text}>Date de fin :</Text>
                    <TouchableOpacity
                      onPress={() => setShowEndDatePicker(true)}>
                      <Text style={styles.dateText}>
                        {moment(updatedEndDate).format("DD-MM-YYYY")}
                      </Text>
                    </TouchableOpacity>
                    {showEndDatePicker && (
                      <DateTimePicker
                        value={updatedEndDate}
                        mode="date"
                        display="default"
                        minimumDate={
                          updatedStartDate || moment().startOf("day").toDate()
                        }
                        maximumDate={new Date(2090, 0, 1)}
                        onChange={(event, selectedDate) => {
                          setShowEndDatePicker(false); // ferme le DateTimePicker
                          if (selectedDate) {
                            handleEndDateChange(event, selectedDate);
                          }
                        }}
                      />
                    )}
                  </View>

                  <Text style={styles.Text}>Type :</Text>
                  <DropdownInput
                    data={tournamentSchedule}
                    placeholder={updatedTournamentType}
                    value={updatedTournamentType}
                    onChange={(item) => setUpdatedTournamentType(item.value)}
                    style={styles.dropdown}
                  />

                  <Text style={styles.Text}>Genre :</Text>
                  <DropdownInput
                    data={tournamentGenders}
                    placeholder={updatedGender}
                    value={updatedGender}
                    onChange={(item) => setUpdatedGender(item.value)}
                    style={styles.dropdown}
                  />

                  <Text style={styles.Text}>Capacité Max :</Text>
                  <DropdownInput
                    data={tournamentCapacity}
                    placeholder={updatedPlayersNumber}
                    value={updatedPlayersNumber}
                    onChange={(item) => setUpdatedPlayersNumber(item.value)}
                    keyboardType="numeric"
                    style={styles.dropdown}
                  />

                  <Text style={styles.Text}>Prix :</Text>
                  <Input
                    placeholder={`${updatedFee} €`}
                    value={updatedFee}
                    onChangeText={setUpdatedFee}
                    keyboardType="numeric"
                  />

                  <ValidateButton
                    title="Sauvegarder"
                    onPress={handleUpdateTournament}
                  />

                  <ValidateButton title="Supprimer" onPress={handleDelete} />
                </>
              )}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <NavigateButton
                title="Fermer"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "85%",
    justifyContent: "space-between",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#0028c6",
  },
  modalText: {
    fontSize: 18,
    color: "#444",
    marginBottom: 15,
  },
  dropdown: {
    marginBottom: 20,
    width: "100%",
    backgroundColor: "#f0f4ff",
    borderRadius: 10,
    padding: 10,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#ff5733",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },

  datePickerContainer: {
    marginBottom: 15,
    width: "100%",
  },
  Text: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  tournamentList: {
    flexGrow: 1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  tournamentCategory: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0028c6",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  tournamentText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  tournamentHighlight: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
  },
  formCard: {
    width: "100%",
    marginVertical: 10,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#FFE6A2",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0028c6",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subTitle: {
    fontSize: 20,
    color: "#4a4a4a",
    marginBottom: 5,
  },
  tournamentCount: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  separator: {
    width: "80%",
    height: 2,
    backgroundColor: "#d6deff",
    marginVertical: 10,
  },

  tournamentsListContainer: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
  },
  noTournamentText: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginTop: 20,
  },
});
