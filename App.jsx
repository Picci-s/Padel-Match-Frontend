// import des modules react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import de safe area context
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
// import des composants (screens)
import PlayerOpenScreen from './screens/PlayerOpenScreen';
import PlayerSignUpScreen from './screens/PlayerSignUpScreen';
import PlayerLoginScreen from './screens/PlayerLoginScreen';
import PlayerHomeScreen from './screens/PlayerHomeScreen';
import PlayerSearchScreen from './screens/PlayerSearchScreen';
import PlayerTournamentsScreen from './screens/PlayerTournamentsScreen';
import PlayerRegisterScreen from './screens/PlayerRegisterScreen';
import PlayerProfileScreen from './screens/PlayerProfileScreen';
import ClubOpenScreen from './screens/ClubOpenScreen';
import ClubSignUpScreen from './screens/ClubSignUpScreen';
import ClubLoginScreen from './screens/ClubLoginScreen';
import ClubHomeScreen from './screens/ClubHomeScreen';
import ClubCreateScreen from './screens/ClubCreateScreen';
import ClubTournamentsScreen from './screens/ClubTournamentsScreen';
import ClubProfileScreen from './screens/ClubProfileScreen';
// import des composants de Redux
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import club from './reducers/club';
import player from './reducers/player';
// import du composant Expo font (faire yarn add expo-font si non trouvé)
import { useFonts } from 'expo-font';
// import des librairies d'icônes
import Ionicons from 'react-native-vector-icons/Ionicons';

//combine reducers
const reducers = combineReducers({ club, player });
//store
const store = configureStore({
  reducer: reducers,
});

export default function App() {
  // initialise les fonts précédemment dl dans assets/fonts
  const [fonts] = useFonts({
    K2D: require('./assets/fonts/K2D-Medium.ttf'),
    JostRegular: require('./assets/fonts/Jost-Regular.ttf'),
    JostSemiBold: require('./assets/fonts/Jost-SemiBold.ttf'),
    Cambay: require('./assets/fonts/Cambay-Regular.ttf'),
  });
  // permet de charger les bonnes fonts directement
  if (!fonts) {
    return null;
  }
  // initialisation de la navigation par lien (Stack)
  const Stack = createNativeStackNavigator();
  // initialisation de la navigation par menu (Tab)
  const Tab = createBottomTabNavigator();

  /* la navigation est imbriquées (nested) sur 3 niveaux (Stack > Tab > Stack) => commencer par créer les niveaux inférieurs (composants enfants) puis les appeler dans le niveau supérieur (niveau parent) */
  // création du menu de navigation côté Joueurs
  // niveau 3 : écrans de la recherche de tournois => menu "Chercher un tournoi"
  const PlayerTournamentsNavigator = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Chercher un tournoi" component={PlayerSearchScreen} />
        <Stack.Screen name="S'inscrire au tournoi" component={PlayerRegisterScreen} />
      </Stack.Navigator>
    )
  }
  // niveau 2 : navigation par menus
  const PlayerTabNavigator = () => {
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          // définir les icônes par screen et selon s'il est actif
          if (route.name === "Accueil") {
            iconName = focused
              ? "home"
              : "home-outline"
          } else if (route.name === "Trouver un tournoi") {
            iconName = focused
              ? "search"
              : "search-outline"
          } else if (route.name === "Mes tournois") {
            iconName = focused
              ? "trophy"
              : "trophy-outline"
          }
          return <Ionicons name={iconName} size={size} color="#0028c6" />
        },
        tabBarStyle: {
          backgroundColor: "#ffe6a2",
          borderTopWidth: 1,
          borderColor: "#0028c6",
        },
        tabBarLabelStyle: {
          fontFamily: "Cambay",
          fontSize: 12,
          fontWeight: 700,
          color: "#0028c6",
        },
        tabBarHideOnKeyboard: true,
        headerShown: false
      })
      }>
        <Tab.Screen name="Accueil" component={PlayerHomeScreen} />
        <Tab.Screen name="Trouver un tournoi" component={PlayerTournamentsNavigator} />
        <Tab.Screen name="Mes tournois" component={PlayerTournamentsScreen} />
      </Tab.Navigator>
    )
  }

  // création du menu de navigation côté Clubs
  // niveau 2 : navigation par menus
  const ClubTabNavigator = () => {
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          // définir les icônes par screen et selon s'il est actif
          if (route.name === "Mon club") {
            iconName = focused
              ? "home"
              : "home-outline"
          } else if (route.name === "Créer un tournoi") {
            iconName = focused
              ? "calendar"
              : "calendar-outline"
          } else if (route.name === "Gérer mes tournois") {
            iconName = focused
              ? "options"
              : "options-outline"
          }
          return <Ionicons name={iconName} size={size} color="#0028c6" />
        },
        tabBarStyle: {
          backgroundColor: "#d6deff",
          borderTopWidth: 1,
          borderColor: "#0028c6",
        },
        tabBarLabelStyle: {
          fontFamily: "Cambay",
          fontSize: 12,
          fontWeight: 700,
          color: "#0028c6",
        },
        tabBarHideOnKeyboard: true,
        headerShown: false
      })
      }>
        <Tab.Screen name="Mon club" component={ClubHomeScreen} />
        <Tab.Screen name="Créer un tournoi" component={ClubCreateScreen} />
        <Tab.Screen name="Gérer mes tournois" component={ClubTournamentsScreen} />
      </Tab.Navigator>
    )
  }

  // App root avec la navigation de niveau 1
  return (
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* écrans joueur */}
            <Stack.Screen name="PlayerOpenScreen" component={PlayerOpenScreen} />
            <Stack.Screen name="PlayerSignUpScreen" component={PlayerSignUpScreen} />
            <Stack.Screen name="PlayerLoginScreen" component={PlayerLoginScreen} />
            <Stack.Screen name="PlayerTabNavigator" component={PlayerTabNavigator} />
            <Stack.Screen name="Profil Joueur" component={PlayerProfileScreen} />
            {/* écrans administrateur de club */}
            <Stack.Screen name="ClubOpenScreen" component={ClubOpenScreen} />
            <Stack.Screen name="ClubSignUpScreen" component={ClubSignUpScreen} />
            <Stack.Screen name="ClubLoginScreen" component={ClubLoginScreen} />
            <Stack.Screen name="ClubTabNavigator" component={ClubTabNavigator} />
            <Stack.Screen name="Profil Club" component={ClubProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}