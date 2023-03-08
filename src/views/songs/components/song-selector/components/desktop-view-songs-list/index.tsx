import { Song } from "@app-types/entities/songs";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";

type SongsListDesktopViewProps = {
  songs: Song[];
};

export const DesktopViewSongsList = (props: SongsListDesktopViewProps) => {
  return (
    <Col className="mt-3 d-none d-sm-block" md={8}>
      <Table>
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
            return (
              <tr>
                <td>{song.bookNum}</td>
                <td>{song.name}</td>
                <td>{song.numOfVerses}</td>
                <td>{song.hasChorus ? "Yes" : "No"}</td>
                <td>
                  <Button>Open</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Col>
  );
};
