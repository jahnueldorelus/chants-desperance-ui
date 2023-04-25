import { Song } from "@app-types/entities/songs";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import { bookService } from "@services/books";
import { Book } from "@app-types/entities/books";

type SongsListMobileViewProps = {
  songs: Song[];
  books?: Book[];
  onSongClick: (song: Song) => () => void;
};

export const MobileViewSongsList = (props: SongsListMobileViewProps) => {
  const createSongInfoText = (title: string, text: string) => {
    return (
      <div>
        <h6 className="mb-0 d-inline-block fw-bold">{title}</h6>
        &nbsp;
        <p className="mb-0 d-inline-block">{text}</p>
      </div>
    );
  };

  return (
    <Accordion className="mt-3 d-sm-none">
      {props.songs.map((song, index) => {
        const songBook = bookService.findBookById(props.books, song.catId);
        let songBookLang: string = "";
        let songBookName: string = "";

        if (songBook) {
          switch (songBook.lang) {
            case "fr":
              songBookLang = "French";
              break;
            case "kr":
              songBookLang = "Kreyol";
              break;
            case "kr-fr":
              songBookLang = "Kreyol and French";
              break;
          }

          songBookName = `${songBook.name} (${songBookLang})`;
        }

        return (
          <Accordion.Item eventKey={index.toString()} key={song._id}>
            <Accordion.Header as="h2">
              <span className="me-2 fs-6 fw-bold text-primary d-inline-block">
                {song.bookNum}&#41;
              </span>
              <span className="me-2 text-primary d-inline-block">
                {song.name}
              </span>
            </Accordion.Header>

            <Accordion.Body className="text-tertiary">
              {songBookName && createSongInfoText("Book:", songBookName)}

              {createSongInfoText(
                "Number of Verses:",
                song.numOfVerses.toString()
              )}

              {createSongInfoText("Has Chorus:", song.hasChorus ? "Yes" : "No")}

              <Button className="mt-3 w-100" onClick={props.onSongClick(song)}>
                Open
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};
