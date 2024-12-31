// Définir le CSS des différents composants View pour les utiliser sur l'ensemble de l'application => penser à les importer dans chaque Screen !

export const playerScreen = {
    flex: 1,
    paddingTop: "5%",
    backgroundColor: "#d6deff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
};

export const clubScreen = {
    flex: 1,
    paddingTop: "5%",
    backgroundColor: "#ffe6a2",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
};

export const scrollContainer = {
    flexGrow: 1,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
};

export const screenTitle = {
    fontFamily: "K2D",
    fontSize: 30,
    fontWeight: 500,
    textAlign: "center",
};

export const subTitle = {
    fontsFamily: "JostSemiBold",
    paddingBottom: 15,
    fontSize: 20,
};

export const titleTopContainer = {
    padding: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

export const formCard = {
    width: "90%",
    minWidth: "90%",
    margin: 10,
    padding: 20,
    backgroundColor: "#fcfbf8",
    borderRadius: 15,
};

export const linkStyle = {
    marginTop: 30,
    marginBottom: 30,
    fontFamily: "JostSemiBold",
    fontSize: 20,
    color: "#0028c6",
    textDecorationLine: "underline",
};
