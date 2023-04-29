import { UserProviderProps, UserState } from "@app-types/context/user";
import { Song } from "@app-types/entities/songs";
import { UserData } from "@app-types/services/auth";
import { authService } from "@services/auth";
import { songsService } from "@services/songs";
import { createContext, useEffect, useState } from "react";

const context = createContext({} as UserState); // Context initial state will be changed in provider
const { Provider } = context;

const UserProvider = (props: UserProviderProps) => {
  // The user's info
  const [user, setUser] = useState<UserData | null>(null);

  // The SSO url to redirect to if an SSO login request is required
  const [ssoAuthUrl, setSSOAuthUrl] = useState<string | null>(null);

  // Determines if an authentication request is processing
  const [authProcessing, setAuthProcessing] = useState<boolean>(false);

  // A map of the user's favorite songs
  const [favoriteSongs, setFavoriteSongs] = useState<Map<string, Song>>(
    new Map()
  );

  /**
   * Retrieves the user's favorite songs when the user becomes available.
   */
  useEffect(() => {
    if (user) {
      getUserFavoriteSongs();
    }
  }, [user]);

  /**
   * Retrieves the user's favorite songs.
   */
  const getUserFavoriteSongs = async () => {
    const favoriteSongsList = await songsService.getAllFavoriteSongs();

    if (favoriteSongsList) {
      const newFavoriteSongsSet: Map<string, Song> = new Map();
      favoriteSongsList.forEach((song) =>
        newFavoriteSongsSet.set(song._id, song)
      );

      setFavoriteSongs(newFavoriteSongsSet);
    }
  };

  /**
   * Determines if a song is one of the user's favorite songs.
   * @param song The song to determine if it's a favorite
   */
  const isSongAFavorite = (song: Song) => {
    /**
     * If the user is signed in, a check is made to see if the song is
     * a favorite. Otherwise, false is returned by and the list of
     * favorite songs is cleared if it's populated
     */
    if (user) {
      return favoriteSongs.has(song._id);
    } else {
      setFavoriteSongs(new Map());
      return false;
    }
  };

  /**
   * Retrieves all the user's favorite songs.
   */
  const getFavoriteSongs = async () => {
    const songs = await songsService.getAllFavoriteSongs();
    const tempFavoriteSongs: Map<string, Song> = new Map();

    if (songs) {
      songs.forEach((song) => tempFavoriteSongs.set(song._id, song));
      setFavoriteSongs(tempFavoriteSongs);
    }
  };

  /**
   * Adds a song to the user's list of favorite songs.
   * @param song The song to add
   */
  const addFavoriteSong = async (song: Song) => {
    const songWasAdded = await songsService.addFavoriteSong(song);

    if (songWasAdded) {
      setFavoriteSongs(favoriteSongs.set(song._id, song));
    }
  };

  /**
   * Removes a song from the user's list of favorite songs.
   * @param song The song to remove
   */
  const removeFavoriteSong = async (song: Song) => {
    const songWasRemoved = await songsService.removeFavoriteSong(song);

    if (songWasRemoved) {
      favoriteSongs.delete(song._id);

      setFavoriteSongs(favoriteSongs);
    }
  };

  /**
   * Retrieves a favorite song if it exists.
   */
  const getFavoriteSongById = (songId: string) => {
    return favoriteSongs.get(songId) || null;
  };

  /**
   * Attempts to sign in the user.
   */
  const signInUser = async () => {
    setAuthProcessing(true);

    const response = await authService.signInUser();

    // If the response is the SSO authentication url
    if (typeof response === "string") {
      setSSOAuthUrl(response);

      /**
       * 
       */
    }
    // The response is the user's data
    else {
      setUser(response);
      setAuthProcessing(false);
    }
  };

  /**
   * Attempts to sign out the user.
   */
  const signOutUser = async () => {
    setAuthProcessing(true);

    const signedOutUser = await authService.signOutUser();

    if (signedOutUser) {
      setUser(null);
    }

    setAuthProcessing(false);
    return signedOutUser ? true : false;
  };

  /**
   * Attempts to reauthenticate the user.
   */
  const reauthorizeUser = async () => {
    const userData = await authService.getUserReauthorized();
    setUser(userData);
  };

  const providerValue: UserState = {
    state: {
      user,
      favoriteSongs,
      ssoAuthUrl,
      authProcessing,
    },
    methods: {
      setUser,
      isSongAFavorite,
      getFavoriteSongs,
      addFavoriteSong,
      removeFavoriteSong,
      getFavoriteSongById,
      signInUser,
      signOutUser,
      reauthorizeUser,
    },
  };

  return <Provider value={providerValue} children={props.children} />;
};

export { context as userContext, UserProvider };