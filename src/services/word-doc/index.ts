import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import { Verse } from "@app-types/entities/verses";
import { Document, Packer, TextRun, Paragraph, HeadingLevel } from "docx";
import { saveAs as saveFileAs } from "file-saver";
import { versesService } from "@services/verses";

class WordDocService {
  async createWordDocumentFromSong(book: Book, song: Song, verses: Verse[]) {
    const bookLanguage =
      book.lang === "kr" ? "Kréyol" : book.lang === "fr" ? "Français" : "";

    const fontSize = "12pt";

    // The word document header
    const documentTitle = [
      new Paragraph({
        heading: HeadingLevel.HEADING_6,
        children: [
          new TextRun({
            text: `${book.name} ${bookLanguage}`,
            size: fontSize,
          }),
        ],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_5,
        children: [
          new TextRun({
            text: `#${song.bookNum} ${song.name}`,
            size: fontSize,
          }),
        ],
      }),
      // Empty line for spacing
      new Paragraph({
        text: "",
      }),
    ];

    const documentBody = verses.reduce((verseParagraph: Paragraph[], verse) => {
      // The verse number
      const verseNumber: Paragraph[] = [
        // Empty line for spacing
        new Paragraph({
          text: "",
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: versesService.getVerseNumber(verse, song),
              size: fontSize,
            }),
          ],
        }),
      ];

      // The verses
      const verseLines: Paragraph[] = [];
      verse.verse
        .split("\n")
        // Adds the verses individually so that they can be on separate lines
        .forEach((line: string) =>
          verseLines.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: fontSize,
                }),
              ],
            })
          )
        );

      // Adds the verse number
      verseParagraph.push(...verseNumber, ...verseLines);

      return verseParagraph;
    }, []);

    // The word document
    const songWordDocument = new Document({
      sections: [
        {
          children: documentTitle.concat(documentBody),
        },
      ],
    });

    // The mime type that will associate the new document with Microsoft Word
    const mimeType =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    // Creates a blob from the document
    const blobInfo = await Packer.toBlob(songWordDocument);
    const songWordDocBlob: Blob = blobInfo.slice(0, blobInfo.size, mimeType);

    saveFileAs(songWordDocBlob, `${song.name}.docx`);
  }
}

export const wordDocService = new WordDocService();
