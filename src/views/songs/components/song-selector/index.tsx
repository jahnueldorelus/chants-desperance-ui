import { Book } from "@app-types/entities/books";
import { uiSearchParams } from "@components/header/uiSearchParams";
import Button from "react-bootstrap/Button";
import Placeholder from "react-bootstrap/Placeholder";
import Col from "react-bootstrap/Col";
import { useSearchParams } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";
import { songsService } from "@services/songs";
import { Song } from "@app-types/entities/songs";
import { bookService } from "@services/books";
import { SongsListView } from "./components/songs-list-view";

type SongSelectorProps = {
  book: Book | null;
  song: Song | null;
  setSelectedBook: (book: Book | null) => void;
  setSelectedSong: (song: Song | null) => void;
};

export const SongSelector = (props: SongSelectorProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [loadingSongs, setLoadingSongs] = useState(false);

  /**
   * Retrieves the list of songs of the selected book.
   */
  useEffect(() => {
    getSongs();
  }, [props.book]);

  /**
   * Retrieves the song from the id found within the URL if present.
   */
  useEffect(() => {
    if (songs && songs.length > 0) {
      const urlSongId = searchParams.get(uiSearchParams.song) || "";
      const tempSong = songsService.findSongById(songs, urlSongId);

      if (!tempSong) {
        searchParams.delete(uiSearchParams.song);
        setSearchParams(searchParams);
      }

      props.setSelectedSong(tempSong);
    }
  }, [songs]);

  /**
   * Retrieves the list of songs in the selected book if available.
   */
  const getSongs = async () => {
    if (props.book) {
      setLoadingSongs(true);
      let songsList = await songsService.getSongsByBook(props.book._id);

      if (songsList) {
        // Sorts songs by number
        songsList = songsList.sort(
          (songOne, songTwo) => songOne.bookNum - songTwo.bookNum
        );
      }

      setSongs(songsList || []);
      setLoadingSongs(false);
    } else {
      // Resets the list of songs when there's no selected book
      setSongs(null);
    }
  };

  /**
   * Removes the selected book to allow the user to choose another one.
   * @param event The mouse click event
   */
  const onClickGoBack = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    searchParams.delete(uiSearchParams.book);
    setSearchParams(searchParams);
    props.setSelectedBook(null);
  };

  /**
   * Handles clicking a song.
   * @param song The song the user selected
   */
  const onSongClick = (song: Song) => () => {
    searchParams.set(uiSearchParams.song, song._id);
    setSearchParams(searchParams);
    props.setSelectedSong(song);
  };

  /**
   * Displays the list of songs in the selected book.
   */
  const listOfSongsJSX = () => {
    if (loadingSongs) {
      return (
        <Col className="mt-3" xs={4}>
          {[1, 2].map((num) => (
            <div className="px-3 py-3 mb-3 border rounded" key={num}>
              <Placeholder animation="glow">
                <Placeholder xs={8} />
                <Placeholder className="d-block" xs={5} />
                <Placeholder className="mt-3 d-block" xs={6} />
              </Placeholder>
            </div>
          ))}
        </Col>
      );
    } else if (songs && songs.length > 0) {
      return <SongsListView songs={songs} onSongClick={onSongClick} />;
    } else {
      return (
        <div className="mt-3">
          <h4>No songs found</h4>
        </div>
      );
    }
  };

  if (props.book && !props.song) {
    return (
      <div>
        <Button type="button" onClick={onClickGoBack}>
          Go Back
        </Button>

        <div className="mt-4 d-flex align-items-center">
          <h2 className="text-tertiary">{props.book.name}</h2>
          <h4>
            <Badge className="ms-3" bg="tertiary">
              {bookService.getBookLanguage(props.book)}
            </Badge>
          </h4>
        </div>

        {listOfSongsJSX()}
      </div>
    );
  } else {
    return <></>;
  }
};
