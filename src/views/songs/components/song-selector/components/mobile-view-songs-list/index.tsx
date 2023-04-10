import { Song } from "@app-types/entities/songs";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";

type SongsListMobileViewProps = {
  songs: Song[];
  onSongClick: (song: Song) => () => void;
};

export const MobileViewSongsList = (props: SongsListMobileViewProps) => {
  return (
    <Accordion className="mt-3 d-sm-none">
      {props.songs.map((song, index) => {
        return (
          <Accordion.Item eventKey={index.toString()}>
            <Accordion.Header as="h2">
              <span className="me-2 fs-6 fw-bold text-primary d-inline-block">
                {song.bookNum}&#41;
              </span>
              <span className="me-2 text-primary d-inline-block">
                {song.name}
              </span>
            </Accordion.Header>

            <Accordion.Body className="text-tertiary">
              <div>
                <h6 className="mb-0 d-inline-block fw-bold">
                  Number of Verses:
                </h6>
                &nbsp;
                <p className="mb-0 d-inline-block"> {song.numOfVerses}</p>
              </div>

              <div>
                <h6 className="mb-0 d-inline-block fw-bold">Has Chorus:</h6>
                &nbsp;
                <p className="mb-0 d-inline-block">
                  {song.hasChorus ? "Yes" : "No"}
                </p>
              </div>

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
