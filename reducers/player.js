import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    profil: {},
    tournament: [],
    tournamentId: null,
    tournamentCategory: null,
  },
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    //met a jour le profil
    updateProfil: (state, action) => {
      state.value.profil = action.payload;
    },
    // Ajoute un tournoi
    addTournament: (state, action) => {
      state.value.tournament.push(action.payload);
    },
    // permet de stocker l'id du tournoi pour linscription
    addTournamentId: (state, action) => {
      state.value.tournamentId = action.payload;
    },
    // permet de stocker l'id du tournoi pour linscription
    addTournamentCategory: (state, action) => {
      state.value.tournamentCategory = action.payload;
    },
    // annule un tournoi via son ID
    clearTournamentId: (state, action) => {
      state.value.tournamentId = null;
    },
    // annule un tournoi via sa category
    clearTournamentCategory: (state, action) => {
      state.value.tournamentCategory = null;
    },

    // Annule un tournoi via son ID
    cancelTournament: (state, action) => {
      state.value.tournament = state.value.tournament.filter(
        (e) => e.tournamentId !== action.payload
      );
    },
    //deconnexion
    logout: (state) => {
      state.value.profil = {};
    },
    deleteAccount: (state) => {
      state.value.profil = {};
      state.value.tournament = [];
    },
  },
});

export const { updateProfil, addTournament, cancelTournament, addTournamentId, clearTournamentId, logout, deleteAccount, addTournamentCategory, clearTournamentCategory} =
  playerSlice.actions;
export default playerSlice.reducer;
