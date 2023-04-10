import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import { Verse } from "@app-types/entities/verses";
import pptxgen from "pptxgenjs";
import { versesService } from "@services/verses";

class PowerPointService {
  createPowerPointFromSong(book: Book, song: Song, verses: Verse[]) {
    const bookLanguage =
      book.lang === "kr" ? "Kréyol" : book.lang === "fr" ? "Français" : "";

    const powerPoint = new pptxgen();
    const slideBackgroundColor = {
      color: "#FFFFFF",
    };
    const titleColor = "#000000";
    const bodyColor = "#3c4f76";

    // The first slide - Intro
    powerPoint.addSlide().addText(
      [
        {
          text: `${book.name} ${bookLanguage}\n`,
          options: {
            color: titleColor,
          },
        },
        {
          text: `#${song.bookNum} ${song.name}`,
          options: {
            color: bodyColor,
          },
        },
      ],
      {
        align: "center",
        isTextBox: true,
        valign: "middle",
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
        fontSize: 30,
      }
    ).background = slideBackgroundColor;

    // Creates a slide for each verse
    let chorusVerse: {
      text: pptxgen.TextProps[];
      alignment: pptxgen.TextPropsOptions;
    } | null = null;

    verses.forEach((verse) => {
      const slideText: pptxgen.TextProps[] = [
        {
          text: `${versesService.getVerseNumber(verse, song)}\n`,
          options: {
            color: titleColor,
          },
        },
        {
          text: `${verse.verse}`,
          options: { color: bodyColor },
        },
      ];
      const slideAlignment: pptxgen.TextPropsOptions = {
        align: "center",
        isTextBox: true,
        valign: "middle",
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
        fontSize: 30,
      };

      const slide = powerPoint.addSlide();
      slide.addText(slideText, slideAlignment);
      slide.background = slideBackgroundColor;

      // Adds the chorus slide after the verse if a chorus exists
      if (chorusVerse) {
        const newChorusSlide = powerPoint.addSlide();
        newChorusSlide.addText(chorusVerse.text, chorusVerse.alignment);
        newChorusSlide.background = slideBackgroundColor;
      }

      // Saves the verse as the chorus if it's the chorus
      if (verse.isChorus && !chorusVerse) {
        chorusVerse = {
          alignment: slideAlignment,
          text: slideText,
        };
      }
    });

    powerPoint.writeFile({ fileName: `${song.name}.pptx` });
  }
}

export const powerPointService = new PowerPointService();
