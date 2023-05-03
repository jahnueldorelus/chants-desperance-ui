import { UserConsumer } from "@app-types/context/user";

export const initialUserContextState: UserConsumer = {
  state: {
    authProcessing: false,
    favoriteSongs: new Map(),
    ssoAuthUrl: null,
    user: null,
  },
  // These temporary functions will be replaced within the context provider
  methods: {
    setUser: () => {},

    isSongAFavorite: (arg0) => false,

    getFavoriteSongs: async () => {},

    addFavoriteSong: async (arg0) => {},

    removeFavoriteSong: async (arg0) => {},

    getFavoriteSongById: (arg0) => null,

    signInUser: async () => false,

    signOutUser: async () => false,

    reauthorizeUser: async () => {},

    getUserFullName: (arg0) => "",
  },
};
