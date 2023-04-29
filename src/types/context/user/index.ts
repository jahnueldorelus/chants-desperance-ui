import { Song } from "@app-types/entities/songs";
import { UserData } from "@app-types/services/auth";

export type UserState = {
  state: {
    user: UserData | null;
    favoriteSongs: Map<string, Song>;
    ssoAuthUrl: string | null;
    authProcessing: boolean;
  };
  methods: {
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    isSongAFavorite: (song: Song) => boolean;
    getFavoriteSongs: () => Promise<void>;
    addFavoriteSong: (song: Song) => Promise<void>;
    removeFavoriteSong: (song: Song) => Promise<void>;
    getFavoriteSongById: (songId: string) => Song | null;
    signInUser: () => Promise<void>;
    signOutUser: () => Promise<boolean>;
    reauthorizeUser: () => Promise<void>;
  };
};

export type UserProviderProps = {
  children: JSX.Element | JSX.Element[];
};
