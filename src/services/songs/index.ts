import { Song } from "@app-types/entities/songs";
import { apiService } from "@services/api";
import { authService } from "@services/auth";
import { isAxiosError } from "axios";

class SongsService {
  private favorites: Record<string, boolean>;

  constructor() {
    this.favorites = {};
  }

  /**
   * Retrieves the list of all songs.
   */
  async getAllSongs() {
    const response = await apiService.request<Song[]>(
      apiService.routes.get.songs.all
    );

    if (isAxiosError(response)) {
      return null;
    } else {
      return response.data;
    }
  }

  /**
   * Retrieves the list of songs in a book.
   * @param bookId The id of the book to retrieve the songs from
   */
  async getSongsByBook(bookId: string) {
    const response = await apiService.request<Song[]>(
      apiService.routes.get.songs.byBookId.concat(bookId)
    );

    if (isAxiosError(response)) {
      return null;
    } else {
      return response.data;
    }
  }

  /**
   * Retrieves the info of a song.
   * @param songId The id of the song
   */
  async getSongByID(songId: string) {
    const response = await apiService.request<Song>(
      apiService.routes.get.songs.bySongId.concat(songId)
    );

    if (isAxiosError(response)) {
      return null;
    } else {
      return response.data;
    }
  }

  /**
   * Retrieves the list of the user's favorite songs
   * @param songIds The list of song ids to retrieve the info of
   */
  async getAllFavoriteSongs(): Promise<Song[] | null> {
    const response = await authService.sendSSODataToAPI(
      apiService.routes.get.songs.favorites,
      "GET"
    );

    if (isAxiosError(response)) {
      return null;
    } else {
      const favoriteSongs = <Song[]>response.data;
      favoriteSongs.forEach((song) => (this.favorites[song._id] = true));

      return favoriteSongs;
    }
  }

  /**
   * Adds a song to the user's list of favorite songs.
   * @param song The song to add
   */
  async addFavoriteSong(song: Song): Promise<void> {
    const response = await authService.sendSSODataToAPI(
      apiService.routes.post.songs.addFavorite,
      "POST",
      {
        songId: song._id,
      }
    );

    if (!isAxiosError(response)) {
      this.favorites[song._id] = true;
    }
  }

  /**
   * Removes a song from the user's list of favorite songs.
   * @param song The song to remove
   */
  async removeFavoriteSong(song: Song): Promise<void> {
    const response = await authService.sendSSODataToAPI(
      apiService.routes.post.songs.removeFavorite,
      "POST",
      {
        songId: song._id,
      }
    );

    if (!isAxiosError(response)) {
      delete this.favorites[song._id];
    }
  }

  /**
   * Determines if a song is one of the user's favorite songs.
   * @param song The song to determine if it's a favorite
   */
  isSongAFavorite(song: Song): boolean {
    return !!this.favorites[song._id];
  }

  /**
   * Finds a song by song id.
   */
  findSongById(
    songs: Song[] | null | undefined,
    songId: string | null
  ): Song | null {
    if (!songs) {
      return null;
    }

    const foundSong = songs.find((song) => song._id === songId);
    return foundSong || null;
  }
}

export const songsService = new SongsService();
