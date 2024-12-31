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
import { updateProfil } from "../reducers/player";

// importer ci-dessous les composants et éléments de style
import { Input } from "../components/inputs";
import { DropdownInput } from "../components/dropdowns";
import { ValidateButton } from "../components/buttons";
import { formCard, playerScreen, scrollContainer, linkStyle, titleTopContainer, screenTitle, subTitle } from "../components/appStyles";

// importer ci-dessous les données non modifiables du ficher appDatas 
import { backend, EMAIL_REGEX, playerGenders } from "../components/appDatas";

// ajout de l'objet navigation comme propriété du composant
export default function PlayerSignUpScreen({ navigation }) {
    
    // États pour stocker les valeurs des champs de saisie
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [gender, setGender] = useState("");
    const [licence, setLicense] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [street, setStreet] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");
    //const [rank, setRank] = useState("");
    //const [avatar, setAvatar] = useState("");

    //déclaration du dispatch redux
    const dispatch = useDispatch();
    //const profil = useSelector((state) => state.player.value.profil);
    //console.log(profil)

    //Fonction pour gérer l'inscription
    const handleSignUp = () => {
        //Vérifie si tous les champs obligatoires sont remplis
        if (
            !lastName ||
            !firstName ||
            !licence ||
            !email ||
            !password ||
            !street ||
            !zipCode ||
            !city ||
            !phone
        ) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
            return;
        }
        //check l'email
        if (!EMAIL_REGEX.test(email)) {
            Alert.alert("Email non valide", "Email non valide");
            return;
            }

        //Envoi des données au serveur via une requête POSTnodemon
        fetch(`${backend}/players/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                lastName,
                firstName,
                gender,
                email,
                licence,
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
                Alert.alert(`Inscription réussie, Bienvenue ${data.data.firstName} !`);
                navigation.navigate("PlayerTabNavigator"); // Redirection après succès
                dispatch(updateProfil(data))// Mise à jour du profil club dans Redux
            } else {
                Alert.alert(
                    "Erreur",
                    data.error || "Une erreur est survenue lors de l'inscription."
                );
            }
        })
        .catch((error) => {
            console.error(error);
            Alert.alert("Erreur", "Erreur de connexion au serveur.");
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Permet d'éviter le recouvrement du clavier sur iOS */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={playerScreen}>
                <ScrollView contentContainerStyle={scrollContainer}>
                    <View style={titleTopContainer}>
                        <Text style={screenTitle}>Inscription Joueur</Text>
                    </View>

                    <View style={formCard}>
                        <Text style={subTitle}>Profil</Text>
                        <Input
                            placeholder="Nom"
                            onChangeText={(value) => setLastName(value)} 
                            value={lastName}
                        />
                        <Input
                            placeholder="Prénom"
                            onChangeText={(value) => setFirstName(value)} 
                            value={firstName}
                        />
                        <DropdownInput
                            data={playerGenders}
                            placeholder="Genre"
                            value={gender}
                            onChange={item => setGender(item.value)}
                        />
                        <Input
                            placeholder="Numéro de licence"
                            onChangeText={(value) => setLicense(value)} value={licence}
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
                            placeholder="Numéro de téléphone"
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
                            placeholder="Ville"
                            onChangeText={(value) => setCity(value)} 
                            value={city} 
                        />
                        <Input
                            placeholder="Code postal"
                            onChangeText={(value) => setZipCode(value)} 
                            value={zipCode}
                            keyboardType="numeric"
                        />
                    </View>

                    <ValidateButton
                        title="M'inscrire"
                        onPress={handleSignUp}
                    />

                    <Link style={linkStyle} screen="PlayerLoginScreen">Vous avez déjà un compte ?</Link>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


