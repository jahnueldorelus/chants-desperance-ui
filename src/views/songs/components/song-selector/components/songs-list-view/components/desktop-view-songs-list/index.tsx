import { Song } from "@app-types/entities/songs";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import { Book } from "@app-types/entities/books";
import { bookService } from "@services/books";

type SongsListDesktopViewProps = {
  songs: Song[];
  book: Book;
  onSongClick: (song: Song) => () => void;
};

export const DesktopViewSongsList = (props: SongsListDesktopViewProps) => {
  return (
    <Col className="mt-3 d-none d-sm-block" md={12} lg={10}>
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th># of Verses</th>
            <th>Has Chorus</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.songs.map((song) => {
            const bookName = props.book.name;
            const bookLanguage = bookService.getBookLanguage(props.book);

            return (
              <tr className="align-middle" key={song._id}>
                <td>{song.bookNum}</td>
                <td>{song.name}</td>
                <td>{song.numOfVerses}</td>
                <td>{song.hasChorus ? "Yes" : "No"}</td>
                <td>
                  <Button
                    onClick={props.onSongClick(song)}
                    aria-label={`Open song number ${song.bookNum}, ${song.name}, ${bookName} ${bookLanguage}`}
                  >
                    Open
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Col>
  );
};
