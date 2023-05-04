import { Song } from "@app-types/entities/songs";
import { Verse } from "@app-types/entities/verses";
import { versesService } from "@services/verses";

type SongViewBodyProps = {
  song: Song;
  verses: Verse[] | null;
  show: boolean;
};

export const SongViewBody = (props: SongViewBodyProps) => {
  /**
   * Creates verse lines from a verse.
   * @param verse The verse to create verse lines from
   */
  const createVerseLines = (verse: Verse) => {
    const verseLines = verse.verse.split("\n");
    return verseLines.map((line, index) => <h6 key={index}>{line}</h6>);
  };

  /**
   * Creates JSX from a verse.
   * @param verse The verse to convert to JSX
   */
  const createVerseJSX = (verse: Verse) => {
    const verseNumber = versesService.getVerseNumber(verse, props.song);

    return (
      <div className="mt-4" key={verse._id}>
        <h6>{verseNumber}</h6>
        {createVerseLines(verse)}
      </div>
    );
  };

  if (props.show && props.verses) {
    return (
      <div className="mt-4 border rounded overflow-hidden">
        <div className="px-3 py-3 bg-primary text-secondary">
          <h5 className="mb-0">
            #{props.song.bookNum}&nbsp;{props.song.name}
          </h5>
        </div>

        <div className="px-3 pb-4 text-center">
          {props.verses.map((verse) => createVerseJSX(verse))}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
