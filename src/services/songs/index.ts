import { Song } from "@app-types/entities/songs";
import { apiService } from "@services/api";
import { authService } from "@services/auth";
import { isAxiosError } from "axios";

class SongsService {
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
      apiService.routes.post.songs.favorites,
      "POST"
    );

    if (isAxiosError(response)) {
      return null;
    } else {
      return <Song[]>response.data;
    }
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
