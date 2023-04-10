import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import { Verse } from "@app-types/entities/verses";
import { versesService } from "@services/verses";

class EmailService {
  createTextFileFromSong(book: Book, song: Song, verses: Verse[]) {
    const bookLanguage =
      book.lang === "kr" ? "Kréyol" : book.lang === "fr" ? "Français" : "";

    // Creates the subject which is the book name, song name/number, and language
    const subjectUrl = `subject=${book.name.concat(
      "%20",
      bookLanguage,
      "%20-%20"
    )}#${song.bookNum}%20${song.name}`;

    // Creates the body which is all the verses in the song
    const bodyUrl = `body=${verses
      .map((verse) => {
        return versesService
          .getVerseNumber(verse, song)
          .concat("%0A", verse.verse.replace(/\n/g, "%0A"));
      })
      .join("%0A%0A")}`;

    // Opens a new tab to the user's mail client with the song's data
    window.open(`mailto:?${subjectUrl}&${bodyUrl}`);
  }
}

export const emailService = new EmailService();
