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
    Button,
    Modal,
} from "react-native";

// import du calendrier
import DateTimePicker from "@react-native-community/datetimepicker";

// importer ci-dessous les composants de Redux
import { useDispatch, useSelector } from "react-redux";

// importer ci-dessous les données dec components exportable
import {
    backend,
    tournamentGenders,
    tournamentLevel,
} from "../components/appDatas";
import { NavigateButton, ValidateButton } from "../components/buttons";
import { DropdownInput } from "../components/dropdowns";

// import de moment pour le formatage des dates
import moment from "moment";

//import des Icon bibliotheque de react
import { Icon } from "react-native-elements";
import { addTournamentId, addTournamentCategory } from "../reducers/player";

// ajout de l'objet navigation comme propriété du composant
export default function PlayerSearchScreen({ navigation }) {
    // états des critères de recherche
    const [gender, setGender] = useState(null);
    const [category, setCategory] = useState(null);
    const [startDate, setStartDate] = useState(new Date());

    // etat pour la modal du calendrier
    const [showDatePicker, setShowDatePicker] = useState(false);

    // etats pour stocker la liste des tournois
    const [tournaments, setTournaments] = useState([]);
    //console.log(tournaments);

    // etat pour gérer l'affichage de la modal (detail du tournoi)
    const [modalVisible, setModalVisible] = useState(false);

    // etat pour stocker le tournoi sélectionné
    const [selectedTournament, setSelectedTournament] = useState(null);

    // import du reducers player => profil (lecture)
    const profil = useSelector((state) => state.player.value.profil);

    const dispatch = useDispatch();
    //console.log("voici mon profil", profil);

    // variable pour stocker le token du profil player recupere depuis son inscription ou connexion via le store
    const token = profil?.token;
    //console.log("voici mon token", token);

    /*---------------------------------------------------------------------------------------------*/

    // fonction pour réinitialiser les filtres
    const resetFilters = () => {
        setGender(null);
        setCategory(null);
        setStartDate(new Date());
    };

    /*---------------------------------------------------------------------------------------------*/

    // utilisation du useEffect pour appel du fetch de la route (get) affichage des tournois avec autorisation via le token
    // utilisation du useEffect pour permettre le re-render de la page avec les filtres
    useEffect(() => {
        // Formatage de la date avec moment
        const formattedDate = moment(startDate).format("YYYY-MM-DD") || "null";

        // log des paramètres pour le débogage
        //console.log("requête envoyée avec :", {
        //token,
        //formattedDate,
        //category,
        //gender,
        //});

        fetch(
            `${backend}/search/${token}&${formattedDate}&${category || "null"}&${gender || "null"
            }` // utilisation des etats ou null (paramètre de la route get)
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.result) {
                    //console.log("Données reçues du backend :", data);
                    setTournaments(data.tournaments);
                } else {
                    //console.log("Aucun tournoi trouvé pour ces critères.");
                    setTournaments([]);
                }
            })
            .catch((error) => {
                //console.error("Erreur lors de la récupération des tournois :", error);
                Alert.alert(
                    "Erreur",
                    "Une erreur est survenue lors de la récupération des tournois."
                );
            });
    }, [token, startDate, category, gender]); // mis en dependence pour re-render à chaque changement

    /*---------------------------------------------------------------------------------------------*/

    // declaration d'une variable pour recréer un tableau via .map pour afficher les tournois disponibkle avec mise en forme
    // declaration d'uns style conditionel si les places sont inférieur à 5 cela la couleur change en rouge!
    const tournamentsList = tournaments.map((data, key) => {
        const placesRestantes =
            Number(data.players_number) - data.participants.length;
        let placesStyle;
        if (placesRestantes < 5) {
            placesStyle = { color: "red" }; // rouge si il y a moins de 5 places restantes
        } else {
            placesStyle = { color: "#0028c6" }; // bleu sinon
        }

        return (
            <View key={key} style={styles.tournamentItem}>
                <View style={styles.tournamentInfo}>
                    <Text style={styles.tournamentText}>
                        <Text style={styles.labelBold1}>Club :</Text> {data.clubName}
                    </Text>
                    <Text style={styles.tournamentText}>
                        <Text style={styles.labelBold}>Catégorie :</Text> {data.category}
                    </Text>
                    <Text style={styles.tournamentText}>
                        <Text style={styles.labelBold}>Date de début :</Text>{" "}
                        {moment(data.start_date).format("DD-MM-YYYY")}
                    </Text>
                    <Text style={styles.tournamentText}>
                        <Text style={styles.labelBold}>Genre :</Text> {data.gender}
                    </Text>
                    <Text style={styles.tournamentText}>
                        <Text style={styles.labelBold}>Type :</Text> {data.tournamentType}
                    </Text>
                    <Text style={styles.tournamentText}>
                        <Text style={styles.labelBold}>Places restantes :</Text>{" "}
                        <Text style={placesStyle}>{placesRestantes}</Text>
                    </Text>
                </View>

                <View style={styles.iconsContainer}>
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
            </View>
        );
    });

    //console.log("voir ce qu'il y a dedeans ", selectedTournament);

    /*---------------------------------------------------------------------------------------------*/

    // fonction appelée lorsque l'utilisateur sélectionne une date
    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setStartDate(selectedDate);
        }
        setShowDatePicker(false); // ferme le DateTimePicker après la sélection
    };

    // Fonction pour ouvrir le DateTimePicker
    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    /*---------------------------------------------------------------------------------------------*/

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.screenTitle}>Trouver un tournoi</Text>
                    </View>

                    <View style={styles.filtersContainer}>
                        <Text style={styles.subTitle1}>Personnalisez votre recherche</Text>

                        <View style={styles.filterItem}>
                            <Text style={styles.label}>Date :</Text>
                            <View style={styles.dateUnderlineContainer}>
                                <Text style={styles.selectedDate}>
                                    {moment(startDate).format("DD-MM-YYYY")}
                                </Text>
                                <Button
                                    title="Choisir"
                                    onPress={showDatePickerModal}
                                    color="#0028c6"
                                />
                            </View>

                            {/* DateTimePicker pour Android ( grace à plateform ) */}
                            {showDatePicker && Platform.OS === "android" && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                    minimumDate={new Date()}
                                />
                            )}

                            {/* Modal avec DateTimePicker pour iOS  ( grace à plateform ) */}
                            {Platform.OS === "ios" && showDatePicker && (
                                <Modal
                                    transparent={true}
                                    animationType="slide"
                                    visible={showDatePicker}>
                                    <View style={styles.modalOverlayPicker}>
                                        <View style={styles.modalContentPicker}>
                                            <DateTimePicker
                                                value={startDate}
                                                mode="date"
                                                display="inline"
                                                onChange={onDateChange}
                                                themeVariant="light"
                                                style={{ backgroundColor: "white", width: "100%" }}
                                                minimumDate={new Date()}
                                            />
                                            <Button
                                                title="Fermer"
                                                onPress={() => setShowDatePicker(false)}
                                            />
                                        </View>
                                    </View>
                                </Modal>
                            )}
                        </View>

                        <View style={styles.filterItem}>
                            <Text style={styles.label}>Catégorie :</Text>
                            <DropdownInput
                                data={tournamentLevel}
                                placeholder="Catégorie"
                                value={category}
                                onChange={(item) => setCategory(item.value)}
                            />
                        </View>

                        <View style={styles.filterItem}>
                            <Text style={styles.label}>Genre :</Text>
                            <DropdownInput
                                data={tournamentGenders}
                                placeholder="Genre"
                                value={gender}
                                onChange={(item) => setGender(item.value)}
                            />
                        </View>
                    </View>

                    <View style={styles.resetButtonContainer}>
                        <Button
                            title="Réinitialiser les filtres"
                            onPress={resetFilters}
                            color="#0028c6"
                        />
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

            {/*-----------------------------------------CODE POUR LA MODAL DETAIL DU TOURNOI-----------------------------------------------------------*/}

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
                                        {selectedTournament.clubName}
                                    </Text>

                                    <View style={styles.contactRow}>
                                        <Icon
                                            name="map-marker"
                                            type="font-awesome"
                                            size={18}
                                            color="#0028c6"
                                        />
                                        <Text style={styles.modalTextInline}>
                                            {selectedTournament.address?.street},{" "}
                                            {selectedTournament.address?.city},{" "}
                                            {selectedTournament.address?.zipCode}
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
                                            {selectedTournament.email}
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
                                            {selectedTournament.phone}
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
                                    <Text style={styles.modalText}>
                                        <Text style={styles.labelBold}>Places :</Text>{" "}
                                        {selectedTournament.players_number -
                                            selectedTournament.participants.length}{" "}
                                        / {selectedTournament.players_number}
                                    </Text>
                                    <Text style={styles.modalText}>
                                        <Text style={styles.labelBold}>Prix:</Text>{" "}
                                        {selectedTournament.registration_fee} €
                                    </Text>

                                    {/* Conditions Générales */}
                                    <Text style={styles.sectionTitle}>Conditions Générales</Text>
                                    <Text style={styles.modalText}>
                                        {selectedTournament.conditionGenerale}
                                    </Text>
                                </>
                            )}
                            <ValidateButton
                                title="M'inscrire"
                                onPress={() => {
                                    navigation.navigate("S'inscrire au tournoi");
                                    setModalVisible(false);
                                    //console.log(
                                    //  "ID du tournoi dispatché :",
                                    //  selectedTournament?.tournamentId
                                    // );
                                    // console.log(
                                    //  "Information du reducer :",
                                    //  selectedTournament?.category,

                                    // );
                                    dispatch(addTournamentId(selectedTournament?.tournamentId));// envoi de l'id du tournoi au screen register
                                    dispatch(addTournamentCategory(selectedTournament?.category))
                                }}
                            />
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
        fontFamily: "K2D",
        fontSize: 30,
        fontWeight: 500,
        //color: "darkblue",
        textTransform: "uppercase",
        color: "#0028c6",
    },
    subTitle1: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#555555",
        textAlign: "center",
        marginBottom: 20,
        letterSpacing: 1,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingBottom: 20,
        fontsFamily: "JostSemiBold",
    },

    filtersContainer: {
        backgroundColor: "#fdfdfd",
        padding: 12,
        borderRadius: 12,
        marginBottom: 18,
        marginTop: 10,
    },

    filterItem: {
        marginBottom: 15,
    },

    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "dimgray",
    },

    dateFilterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "white",
    },

    dateUnderlineContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        borderColor: "black",
        paddingBottom: 5,
    },

    selectedDate: {
        fontSize: 16,
        color: "dimgray",
        fontFamily: "JostRegular",
    },

    resetButtonContainer: {
        alignSelf: "center",
        marginBottom: 30,
        width: "50%",
    },

    formCard: {
        width: "90%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignSelf: "center",
        marginBottom: 20,
        minHeight: 150,
        maxHeight: 200,
        justifyContent: "space-between",
    },

    subTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        color: "darkslategray",
    },

    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    inputContainer: {
        flex: 1,
        marginHorizontal: 5,
    },

    tournamentsListContainer: {
        width: "90%",
        alignSelf: "center",
        paddingBottom: 20,
    },

    tournamentItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        marginVertical: 10,
        backgroundColor: "whitesmoke",
        borderRadius: 10,
    },

    tournamentInfo: {
        flex: 1,
    },

    tournamentText: {
        fontSize: 16,
        color: "gray",
        marginBottom: 5,
    },

    labelBold1: {
        fontWeight: "bold",
        color: "darkblue",
        fontSize: 18,
    },

    labelBold: {
        fontWeight: "bold",
        color: "black",
    },

    noTournamentText: {
        fontSize: 18,
        color: "darkgray",
        textAlign: "center",
        marginTop: "50%",
    },

    iconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: "5%",
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
    detailIcon: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#d6deff",
        borderRadius: 50,
    },
});
