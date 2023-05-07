import { AddOrUpdateSongInfo, DeleteSongInfo } from "@app-types/services/songs";
import { Song } from "@app-types/entities/songs";
import { UserData } from "@app-types/services/auth";
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
      apiService.routes.get.songs.favorites,
      "GET"
    );

    if (isAxiosError(response)) {
      return null;
    } else {
      const favoriteSongs = <Song[]>response.data;
      return favoriteSongs;
    }
  }

  /**
   * Adds a song to the user's list of favorite songs.
   * @param song The song to add
   */
  async addFavoriteSong(song: Song): Promise<boolean> {
    const response = await authService.sendSSODataToAPI(
      apiService.routes.post.songs.addFavorite,
      "POST",
      {
        songId: song._id,
      }
    );

    if (!isAxiosError(response)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Removes a song from the user's list of favorite songs.
   * @param song The song to remove
   */
  async removeFavoriteSong(song: Song): Promise<boolean> {
    const response = await authService.sendSSODataToAPI(
      apiService.routes.post.songs.removeFavorite,
      "POST",
      {
        songId: song._id,
      }
    );

    if (!isAxiosError(response)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Attempts to update a song.
   * @param user The user who's authorizing the request
   * @param songInfo The song's updated info
   */
  updateSong = async (
    user: UserData,
    songInfo: AddOrUpdateSongInfo
  ): Promise<boolean> => {
    if (user && user.isAdmin) {
      const response = await apiService.request(
        apiService.routes.post.songs.addOrUpdate,
        {
          data: songInfo,
          method: "POST",
        }
      );

      if (!isAxiosError(response)) {
        return true;
      }
    }

    return false;
  };

  /**
   * Attempts to delete a song.
   * @param user The user who's authorizing the request
   */
  deleteSong = async (
    user: UserData,
    deleteSongInfo: DeleteSongInfo
  ): Promise<boolean> => {
    if (user && user.isAdmin) {
      const response = await apiService.request(apiService.routes.delete.song, {
        data: deleteSongInfo,
        method: "DELETE",
      });

      if (!isAxiosError(response)) {
        return true;
      }
    }

    return false;
  };

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
