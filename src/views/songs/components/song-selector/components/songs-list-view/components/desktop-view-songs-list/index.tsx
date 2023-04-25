import { Song } from "@app-types/entities/songs";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import { Book } from "@app-types/entities/books";
import { bookService } from "@services/books";

type SongsListDesktopViewProps = {
  songs: Song[];
  books?: Book[];
  onSongClick: (song: Song) => () => void;
};

export const DesktopViewSongsList = (props: SongsListDesktopViewProps) => {
  return (
    <Col className="mt-3 d-none d-sm-block" md={8}>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            {props.books && <th>Book</th>}
            <th>Name</th>
            <th># of Verses</th>
            <th>Has Chorus</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.songs.map((song) => {
            const songBook = bookService.findBookById(props.books, song.catId);
            const songBookAbbrv = songBook ? songBook.abbrv : "N/A";

            return (
              <tr className="align-middle" key={song._id}>
                <td>{song.bookNum}</td>
                {props.books && <td>{songBookAbbrv}</td>}
                <td>{song.name}</td>
                <td>{song.numOfVerses}</td>
                <td>{song.hasChorus ? "Yes" : "No"}</td>
                <td>
                  <Button onClick={props.onSongClick(song)}>Open</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Col>
  );
};
