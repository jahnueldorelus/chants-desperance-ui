import { apiService } from "@services/api";
import { Song } from "@app-types/entities/songs";
import { Verse } from "@app-types/entities/verses";
import { isAxiosError } from "axios";

class VersesService {
  /**
   * Retrieves the list of verses in a song.
   * @param songId The id of the song to retrieve verses from
   */
  async getVerses(songId: string) {
    const response = await apiService.request<Verse[]>(
      apiService.routes.get.verses.bySongId.concat(songId)
    );

    if (isAxiosError(response)) {
      return null;
    } else {
      return response.data;
    }
  }

  /**
   * Determines the verse number format for a song.
   * @param verse The verse
   * @param song The song
   */
  getVerseNumber(verse: Verse, song: Song) {
    if (verse.isChorus) {
      return song.lang === "fr" ? "Refrain" : "Kè";
    } else {
      return verse.verseNum + ".";
    }
  }
}

export const versesService = new VersesService();
