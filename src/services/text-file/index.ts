import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import { Verse } from "@app-types/entities/verses";
import { saveAs as saveFileAs } from "file-saver";
import { versesService } from "@services/verses";

class TextFileService {
  createTextFileFromSong(book: Book, song: Song, verses: Verse[]) {
    const bookLanguage =
      book.lang === "kr" ? "Kréyol" : book.lang === "fr" ? "Français" : "";

    const fileHeader = `${book.name.concat(" ", bookLanguage, "\n")}#${
      song.bookNum
    } ${song.name}\n\n\n`;

    const fileBody = `${verses
      .map((verse) => {
        return versesService
          .getVerseNumber(verse, song)
          .concat("\n", verse.verse);
      })
      .join("\n\n")}`;

    const blob = new Blob([fileHeader, fileBody], {
      type: "text/plain;charset=utf-8",
    });

    saveFileAs(blob, `${song.name}.txt`);
  }
}

export const textFileService = new TextFileService();
