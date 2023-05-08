import { UserProviderProps, UserConsumer } from "@app-types/context/user";
import { Song } from "@app-types/entities/songs";
import { UserData } from "@app-types/services/auth";
import { authService } from "@services/auth";
import { songsService } from "@services/songs";
import { createContext, useEffect, useState } from "react";
import { initialUserContextState } from "./initial-state";

const context = createContext(initialUserContextState);
const { Provider } = context;

const UserProvider = (props: UserProviderProps) => {
  // The user's info
  const [user, setUser] = useState<UserData | null>(null);

  // The SSO url to redirect to if an SSO login request is required
  const [ssoAuthUrl, setSSOAuthUrl] = useState<string | null>(null);

  // Determines if an authentication request is processing
  const [authReqProcessing, setAuthReqProcessing] = useState<boolean>(false);

  // A map of the user's favorite songs
  const [favoriteSongs, setFavoriteSongs] = useState<Map<string, Song>>(
    new Map()
  );

  /**
   * Retrieves the user's favorite songs when the user becomes available.
   */
  useEffect(() => {
    if (user) {
      getFavoriteSongs();
    }
  }, [user]);

  /**
   * Determines if a song is one of the user's favorite songs.
   * @param song The song to determine if it's a favorite
   */
  const isSongAFavorite = (song: Song) => {
    return favoriteSongs.has(song._id);
  };

  /**
   * Retrieves all the user's favorite songs.
   */
  const getFavoriteSongs = async () => {
    const songs = await songsService.getAllFavoriteSongs();

    if (songs) {
      const tempFavoriteSongs: Map<string, Song> = new Map();
      songs.forEach((song) => tempFavoriteSongs.set(song._id, song));
      setFavoriteSongs(tempFavoriteSongs);

      return true;
    } else {
      setFavoriteSongs(new Map());

      return false;
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
      return true;
    }

    return false;
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
      return true;
    }

    return false;
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
    if (!authReqProcessing && !user) {
      setAuthReqProcessing(true);

      const userDataOrAuthUrl = await authService.signInUser();

      // If the response is the SSO authentication url
      if (typeof userDataOrAuthUrl === "string") {
        setSSOAuthUrl(userDataOrAuthUrl);
      }
      // The response is the user's data
      else {
        setUser(userDataOrAuthUrl);
        setAuthReqProcessing(false);
      }

      return true;
    } else if (user) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Attempts to sign out the user.
   */
  const signOutUser = async () => {
    setAuthReqProcessing(true);

    const signOutAuthUrl = await authService.signOutUser();

    setAuthReqProcessing(false);

    // If a sign out auth url given to navigate to
    if (signOutAuthUrl && typeof signOutAuthUrl === "string") {
      setUser(null);
      location.replace(signOutAuthUrl);
    } else if (signOutAuthUrl) {
      /**
       * If the boolean true was returned (aka user is unauthorized which means
       * that they are already signed out)
       */
      setUser(null);
      return true;
    }

    // An error occurred signing out the user
    return false;
  };

  /**
   * Attempts to reauthenticate the user.
   */
  const reauthorizeUser = async () => {
    setAuthReqProcessing(true);

    const userData = await authService.getUserReauthorized();

    setUser(userData);
    setAuthReqProcessing(false);
  };

  /**
   * Retrieves the full name of a user in titlecase form.
   * @returns The user's full name in title case form or an empty
   *          string if no user was given
   */
  const getUserFullName = (user: UserData | null): string => {
    if (user) {
      return (user.firstName + " " + user.lastName).replace(
        /\w\S*/g,
        (word) =>
          word.charAt(0).toLocaleUpperCase() +
          word.substring(1).toLocaleLowerCase()
      );
    }

    return "";
  };

  const providerValue: UserConsumer = {
    state: {
      user,
      favoriteSongs,
      ssoAuthUrl,
      authProcessing: authReqProcessing,
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
      getUserFullName,
    },
  };

  return <Provider value={providerValue} children={props.children} />;
};

export { context as userContext, UserProvider };
