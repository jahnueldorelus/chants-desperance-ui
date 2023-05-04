import { Song } from "@app-types/entities/songs";
import { UserData } from "@app-types/services/auth";

export type UserState = {
  user: UserData | null;
  favoriteSongs: Map<string, Song>;
  ssoAuthUrl: string | null;
  authProcessing: boolean;
};

export type UserMethods = {
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  isSongAFavorite: (song: Song) => boolean;
  getFavoriteSongs: () => Promise<boolean>;
  addFavoriteSong: (song: Song) => Promise<boolean>;
  removeFavoriteSong: (song: Song) => Promise<boolean>;
  getFavoriteSongById: (songId: string) => Song | null;
  signInUser: () => Promise<boolean>;
  signOutUser: () => Promise<boolean>;
  reauthorizeUser: () => Promise<void>;
  getUserFullName: (user: UserData | null) => string;
};

export type UserConsumer = {
  state: UserState;
  methods: UserMethods;
};

export type UserProviderProps = {
  children: JSX.Element | JSX.Element[];
};
