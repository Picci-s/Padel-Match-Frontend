import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Icon } from "react-native-elements";

// header côté club
export function ClubHeader({ avatar, bellPress, iconName, iconColor, iconBackgroundColor }) {

    // définir une image de profil par défaut
    const [avatarUri, setAvatarUri] = useState("../assets/default-profile-picture.png");
    // récupérer l'avatar s'il existe (non fonctionnel pour l'instant)
    useEffect(() => {
        if (avatar === undefined || avatar === "") {
            return;
        } else {
            setAvatarUri(avatar);
        };
    }, [avatarUri]);

    return (
        <View style={styles.header}>
            <View style={styles.sideContainer}>
                <Image
                    style={styles.avatar}
                    source={require("../assets/default-profile-picture.png")}
                    alt="Photo de profil" 
                />
            </View>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../assets/padel-match-favicone-v2.png')}
                    alt="Logo de l'application"
                />
            </View>
            <View style={styles.sideContainer}>
                <Icon
                    reverse={true}
                    name={iconName}
                    size={28}
                    color={iconBackgroundColor}
                    reverseColor={iconColor}
                    type="font-awesome"
                    onPress={bellPress}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    header: {
        width: "90%",
        maxHeight: "20%",
        marginTop: "5%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    sideContainer: {
        width: "20%",
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
        maxHeight: 66,
        maxWidth: 66,
        aspectRatio: 1,
        borderRadius: 33,
        borderWidth: 1,
    },

    logo: {
        display: "flex",
        maxHeight: 200,
        maxWidth: 200,
        padding: 10,
    },
});