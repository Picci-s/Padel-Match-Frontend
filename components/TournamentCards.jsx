import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, View } from "react-native";

export default function ClubTournamentCard(props) {
  // Calcul du nombre de places restantes
  const placesRestantes = props.players_number - props.participants;

  //console.log("players_number :", props.players_number);
  //console.log("participants :", props.participants);

  // condition style en fonction des places restantes
  let placesStyle;
  if (placesRestantes < 8) {
    placesStyle = { color: "red" }; // rouge si il y a moins de 5 places restantes
  } else {
    placesStyle = { color: "#0028c6" }; // bleu sinon
  }

  return (
    <View style={styles.card}>
      <View style={styles.leftColumn}>
        <Text style={styles.labelBold}>
          Catégorie : <Text style={styles.text}>{props.category}</Text>
        </Text>
        <Text style={styles.labelBold}>
          Date : <Text style={styles.text}>{props.start_date}</Text>
        </Text>
      </View>
      <View style={styles.rightColumn}>
        <Text style={styles.text}>
          Participants : {props.participants} / {props.players_number}
        </Text>
        <Text style={[styles.text, placesStyle]}>
      Places restantes: {placesRestantes}
        </Text>
      </View>
    </View>
  );
}

export function PlayerTournamentCard(props) {
  return (
    <View style={styles.card}>
      <View style={styles.leftColumnPlayer}>
      <Text style={styles.labelBold}>
          Date : <Text style={styles.text}>{props.start_date}</Text>
        </Text>
        <Text style={styles.labelBold}>
          Club : <Text style={styles.text}>{props.clubName || "Club inconnu"}</Text>
        </Text>
        
      </View>
      <View style={styles.rightColumnPlayer}>
      <Text style={styles.labelBold}>
          Catégorie : <Text style={styles.text}>{props.category}</Text>
        </Text>
       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginBottom: 10,
    padding: 20,
    backgroundColor: "#fcfbf8",
    borderRadius: 10,
    flexDirection: "row",
  },

  leftColumn: {
    width: "60%",
  },

  rightColumn: {
    width: "40%",
   justifyContent:'space-around',
  },

  labelBold: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0028c6",
    marginBottom: 5,
  },

  text: {
    fontSize: 14,
    color: "#333",
  },

  leftColumnPlayer: {
    width: "60%",
    marginTop: 5,
  },
  rightColumnPlayer: {
    width: "44%",
    marginTop: "6%",
  },

});
