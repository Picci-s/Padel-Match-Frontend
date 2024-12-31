import { createSlice} from '@reduxjs/toolkit';

const initialState = {
    value: { 
        profilClub: {},
        invoice: [],
        tournament: [],
        data: {name: null, email: null, phone: null, street: null, city: null, zipCode: null}
      },
  };
  
  export const clubSlice = createSlice({
    name: 'club',
    initialState,
    reducers: {
    //met à jour le profil
      updateProfilClub: (state, action) => {
        state.value.profilClub = action.payload;
      },
    //deconnexion
      logout: (state) => {
        state.value.token = null;
        state.value.username = null;
      },
    //ajoute un tournois
      addTournament: (state, action) => {
        state.value.tournament.push(action.payload);  
      },
    //supprime un tournois via id
      deleteTournament: (state, action) => {
        state.value.tournament = state.value.tournament.filter(e => e.id !== action.payload);
      },
    //ajoute les factures
      addInvoice: (state, action) => {
        state.value.invoice.push(action.payload);
      },
      //deconnexion
      logout: (state) => {
        state.value.token = null;
        state.value.username = null;
      },
      //suppression de compte
      deleteAccount: (state) => {
        state.value.profilClub = {};
        state.value.invoice = [];
        state.value.tournament = [];
      }
    },
  });
  
  export const { updateProfilClub, addTournament, deleteTournament, addInvoice, logout, deleteAccount } = clubSlice.actions;
  export default clubSlice.reducer;