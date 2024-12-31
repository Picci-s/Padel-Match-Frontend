import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Modal,
  View,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { DropdownInput } from "../components/dropdowns";
import { useDispatch, useSelector } from "react-redux";
import { addTournament } from "../reducers/club";
import moment from "moment";

// import des éléments de style personnalisés
import { clubScreen } from "../components/appStyles";
import { screenTitle } from "../components/appStyles";
import { NavigateButton, ValidateButton } from "../components/buttons";

import {
  tournamentGenders,
  tournamentLevel,
  tournamentSchedule,
  tournamentCapacity,
  backend,
} from "../components/appDatas";

export default function ClubCreateScreen() {
  // États pour les modales
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEvenement, setModalEvenement] = useState(false);
  // État des détails des événements
  const [evenementDetail, setEvenementDetail] = useState(null);
  // États pour les dates
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // État pour gerer le marquage temporaire
  const [dateMark, setDateMark] = useState([]);
  // État pour stocker les événements dans l'Agenda
  const [evenement, setEvenement] = useState({});
  // État pour gerer les couleurs
  const [categoryColor, setCategoryColor] = useState(null);
  // États pour les champs de configuration du tournoi
  const [gender, setGender] = useState(null);
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState("");
  const [tournamentType, setTournamentType] = useState("Journée");
  const [registrationFee, setRegistrationFee] = useState("");

  const dispatch = useDispatch();
  const profilClub = useSelector((state) => state.club.value.profilClub);


  //----------------------------------------------------------------------------------------------------//

  // Fonction pour gérer la sélection des dates
  const pressDay = (day) => {
    const selectedDate = day.dateString;
    //si aucune date de début on l'ajoute
    if (!startDate) {
      setStartDate(selectedDate);
      //marque uniquement la date de debut
      updateDateMark(selectedDate, null);
    }
    //si aucune date de fin on l'ajoute
    else if (!endDate) {
      setEndDate(selectedDate);
      //marque toute la période
      updateDateMark(startDate, selectedDate);
    }
    //si les deux dates sont choisie on reinitialise
    else {
      setStartDate(selectedDate);
      setEndDate(null);
      updateDateMark(selectedDate, null);
    }
  };

  //----------------------------------------------------------------------------------------------------//

  // Fonction pour ajouter les dates sélectionnées à l'état evenement
  const updateEvenement = (
    startDate,
    endDate,
    category,
    tournamentType,
    players_number
  ) => {
    let updatedEvents = { ...evenement };

    let currentDate = moment(startDate).startOf("day");
    const end = moment(endDate).endOf("day");

    while (currentDate.isSameOrBefore(end)) {
      const dateStr = currentDate.format("YYYY-MM-DD");

      if (!updatedEvents[dateStr]) {
        updatedEvents[dateStr] = [];
      }

      updatedEvents[dateStr].push({
        name: `Tournoi ${category} (${tournamentType})`,
        category: category,
        tournamentType: tournamentType,
        players_number: Number(players_number),
        debut: startDate,
        end: endDate,
      });

      currentDate.add(1, "days"); // Déplacer l'incrémentation ici
    }

    setEvenement(updatedEvents);
  };

  //console.log("Start Date:", startDate);
  //console.log("End Date:", endDate);

  //----------------------------------------------------------------------------------------------------//

  // Fonction pour marquer les dates sélectionnées dans le calendrier
  const getMarkedDates = () => {
    //ajoute les marqueurs temporaires
    let dateMarked = { ...dateMark };

    // Parcours les événements et applique les couleurs
    Object.keys(evenement).forEach((date) => {
      const event = evenement[date];
      if (event && event.length > 0) {
        const categoryColor = getCategoryColor(event[0].category);
        dateMarked[date] = { selected: true, selectedColor: categoryColor };
      }
    });

  return dateMarked;
};

  //----------------------------------------------------------------------------------------------------//

const updateDateMark = (start, end) => {
  let tempDates = {};
  if (start && end) {
    let currentDate = moment(start).startOf("day");
    const endDate = moment(end).endOf("day");

      while (currentDate.isSameOrBefore(endDate)) {
        const dateStr = currentDate.format("YYYY-MM-DD");
        tempDates[dateStr] = { selected: true, selectedColor: "blue" }; // Couleur par défaut
        currentDate.add(1, "days");
      }
    } else if (start) {
      tempDates[start] = { selected: true, selectedColor: "blue" }; // Marquer uniquement la date de début
    }
    setDateMark(tempDates);
  };

  //----------------------------------------------------------------------------------------------------//

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

//----------------------------------------------------------------------------------------------------//

// pour créer une légende
const Legend = () => {
  const categories = [
    { label: "P25", color: getCategoryColor("P25") },
    { label: "P100", color: getCategoryColor("P100") },
    { label: "P250", color: getCategoryColor("P250") },
    { label: "P500", color: getCategoryColor("P500") },
    { label: "P1000", color: getCategoryColor("P1000") },
    { label: "P1500", color: getCategoryColor("P1500") },
    { label: "P2000", color: getCategoryColor("P2000") },
  ];

    return (
      <View style={styles.legendContainer}>
        {categories.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  //----------------------------------------------------------------------------------------------------//


  // Fonction pour soumettre le tournoi
  const handleNewTournament = () => {
    // console.log(gender)
    // console.log(category)
    // console.log(capacity)
    // console.log(tournamentType)
    // console.log(registrationFee)
    // console.log(startDate)
    // console.log(endDate)
    // console.log(profilClub)
    // Vérifier si la date de début est inférieure à aujourd'hui
    const today = moment().startOf("day").toDate();
    const tournamentStartDate = moment(startDate).startOf("day").toDate();

    if (tournamentStartDate < today) {
      Alert.alert(
        "Erreur",
        "La date de début ne peut pas être antérieure à aujourd'hui."
      );
      return;
    }
    if (
      !gender ||
      !category ||
      !capacity ||
      !tournamentType ||
      !registrationFee ||
      !startDate
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs requis.");
      return;
    }

  // Si pas de endDate alors seulement startDate marche pour créer le tournois
  const endTournamentDate = endDate || startDate;

    fetch(`${backend}/tournaments/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clubId: profilClub?.data._id,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endTournamentDate).format("YYYY-MM-DD"),
        gender,
        category,
        players_number: Number(capacity),
        tournamentType,
        registration_fee: Number(registrationFee),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          //console.log('voci les information stockée ', data.data.tournament)
          //met à jour les evenements pour y inclure le startDate/endDate
          let currentDate = moment(startDate).startOf("day");
          const end = moment(endTournamentDate).endOf("day");
          const endModif = end.subtract(1, "days");

          while (
            currentDate.isBefore(endModif) || currentDate.isSame(endModif)
          ) {
            setEvenement((prev) => ({
              ...prev,
              [currentDate.format("YYYY-MM-DD")]: [
                ...(prev[currentDate.format("YYYY-MM-DD")] || []),
                {
                  name: `Tournoi ${category} (${tournamentType})`,
                  category: category,
                  tournamentType: tournamentType, // Assurez-vous que cette propriété est incluse
                  players_number: Number(capacity),
                  debut: currentDate.format("YYYY-MM-DD"),
                  end: end.format("YYYY-MM-DD"),
                },
              ],
            }));
            currentDate.add(1, "days");
            //onsole.log("date", currentDate);
          }
          //console.log("evenementDetail :", evenementDetail);
          // met la couleur à jour par rapport à la catégorie choisie
          setCategoryColor(getCategoryColor(category));
          // confirme les events
          updateEvenement(
            startDate,
            endTournamentDate,
            category,
            tournamentType,
            capacity,
          );
          dispatch(
            addTournament({
              data: data.data.tournament,
              dates: [startDate, endTournamentDate],
            })
          );

          Alert.alert("Succès", "Le tournoi a été créé avec succès.");
          // réinitialise les états
          setStartDate(null);
          setEndDate(null);
          setDateMark({});
          setTournamentType("")
          setCapacity("")
          setCategory("")
          setGender("")
          setRegistrationFee("")
          
          setModalVisible(false);
        } else {
          Alert.alert(
            "Erreur",
            data.error || "Échec de la création du tournoi."
          );
        }
      })
      .catch((error) => {
        //console.error("Erreur :", error);
        Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
      });
  };

  //----------------------------------------------------------------------------------------------------//

  //affiche les détail d'un événement
  const eventPress = (date) => {
    const event = evenement[date];
    //console.log(date, event);
    if (event && event.length > 0) {
      setEvenementDetail(event[0]); // Affiche le premier événement de cette date
      setModalEvenement(true); // Ouvre la modal
    }
  };

//----------------------------------------------------------------------------------------------------//

return (
  <SafeAreaView style={clubScreen}>
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.screenTitle}>Club</Text>
      <Text style={[screenTitle, { marginBottom: 50 }]}>
        Créer un tournoi
      </Text>
      {Legend()}

        {/* Calendrier avec styles personnalisés */}
        <View style={{ marginBottom: 20 }}>
          <Calendar
            theme={{
              disabledDayTextColor: "gray", // Style pour les dates désactivées

              // fond du calendrier
              calendarBackground: "white",

            // mois affiché
            monthTextColor: "#0028c6",
            textMonthFontSize: 22,
            textMonthFontWeight: "bold",
            arrowColor: "#0028c6",

            // lundi mardi,.. jours de la semaine
            textSectionTitleColor: "black",
            textDayHeaderFontSize: 16,
            textDayHeaderFontWeight: "bold",

            // jours normaux
            dayTextColor: "#2d4150",
            textDayFontSize: 16,
            textDayFontWeight: "400",

              // aujourd'hui
              todayTextColor: "#ff6347",
              todayBackgroundColor: "#fff5f5",
            }}
            style={{
              borderRadius: 10,
              marginBottom: 20,
              backgroundColor: "#f8f9fa",
              padding: 30,
              minHeight: "50%",
              width: "100%",
              fontSize: 18,
            }}
            onDayPress={pressDay}
            markedDates={getMarkedDates()}
            onDayLongPress={(day) => eventPress(day.dateString)}
            minDate={moment().format("YYYY-MM-DD")} // Désactive toutes les dates passées
          />
        </View>

      {/*----------------------------------------------------------------------------------------------------/*}

        {/* Bouton de navigation personnalisé */}
      <NavigateButton
        title=" Configurer le Tournoi"
        onPress={() => setModalVisible(true)}></NavigateButton>

      {/* Modal pour afficher les détails d'un événement */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEvenement}>
        <ScrollView contentContainerStyle={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.closeIcon}
              onPress={() => setModalEvenement(false)}>
              <Text style={styles.closeIconText}>✕</Text>
            </Pressable>

            {evenementDetail && (
              <View>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      backgroundColor: getCategoryColor(
                        evenementDetail.category
                      ),
                      color: "#fff",
                    },
                  ]}>
                  {evenementDetail.name}
                </Text>
                <Text style={styles.modalText}>
                  Catégorie : {evenementDetail.category}
                </Text>
                <Text style={styles.modalText}>
                  Type de tournoi : {evenementDetail.tournamentType}
                </Text>
                <Text style={styles.modalText}>
                  Capacité : {evenementDetail.players_number}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Modal>

      {/*----------------------------------------------------------------------------------------------------/*}

        {/* Modal de configuration */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ScrollView contentContainerStyle={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeIconText}>✕</Text>
            </Pressable>

            <Text style={[styles.modalTitle, { marginBottom: 20 }]}>
              Configurer le Tournoi
            </Text>
            <View style={styles.dateRangeContainer}>
              <Text style={styles.dateRangeText}>
                Du : {moment(startDate).format("DD-MM-YYYY")} / Au : {moment(endDate).format("DD-MM-YYYY")}
              </Text>
            </View>

              <DropdownInput
                data={tournamentGenders}
                placeholder="Genre"
                value={gender}
                onChange={(item) => setGender(item.value)}
                style={{ marginBottom: 15 }}
              />
              <DropdownInput
                data={tournamentLevel}
                placeholder="Catégorie"
                value={category}
                onChange={(item) => setCategory(item.value)}
                style={{ marginBottom: 15 }}
              />
              <DropdownInput
                data={tournamentCapacity}
                placeholder="Capacité"
                value={capacity}
                onChange={(item) => setCapacity(item.value)}
                style={{ marginBottom: 15 }}
              />
              <DropdownInput
                data={tournamentSchedule}
                placeholder="Type"
                value={tournamentType}
                onChange={(item) => setTournamentType(item.value)}
                style={{ marginBottom: 15 }}
              />

            <TextInput
              style={styles.input}
              placeholder="Frais d'inscription (€)"
              keyboardType="numeric"
              value={registrationFee}
              onChangeText={setRegistrationFee}
            />

            <ValidateButton title="Valider" onPress={handleNewTournament} />
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  </SafeAreaView>
);
}

//----------------------------------------------------------------------------------------------------//

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#4CAF50",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  eventItem: {
    padding: 8,
    backgroundColor: "#f1f1f1",
    marginVertical: 10,
  },
  emptyDate: {
    padding: 20,
    alignItems: "center",
  },
  centeredView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeIconText: {
    fontSize: 24,
    color: "#FF3B30",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0028c6",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  dateRangeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  dateRangeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0028c6",
    backgroundColor: "#f0f4ff",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    width: "100%",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "5%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 16,
  },
});
