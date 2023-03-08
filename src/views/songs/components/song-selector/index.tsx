import { Book } from "@app-types/entities/books";
import { uiSearchParams } from "@components/header/uiSearchParams";
import Button from "react-bootstrap/Button";
import Placeholder from "react-bootstrap/Placeholder";
import Col from "react-bootstrap/Col";
import { useSearchParams } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { Fragment, useEffect, useState } from "react";
import { songsService } from "@services/songs";
import { Song } from "@app-types/entities/songs";
import { DesktopViewSongsList } from "@views/songs/components/song-selector/components/desktop-view-songs-list";
import { MobileViewSongsList } from "@views/songs/components/song-selector/components/mobile-view-songs-list";

type SongSelectorProps = {
  book: Book | null;
  setSelectedBook: (book: Book | null) => void;
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
   * Retrieves the language of the selected book.
   */
  const getBookLang = () => {
    if (props.book) {
      if (props.book.lang === "fr") {
        return "French";
      } else if (props.book.lang === "kr") {
        return "Kreyol";
      } else {
        return "Kreyol and French";
      }
    } else {
      return "";
    }
  };

  /**
   * Displays the list of songs in the selected book.
   */
  const listOfSongsJSX = () => {
    if (loadingSongs) {
      return (
        <Col className="mt-3" xs={4}>
          {[1, 2, 3].map(() => (
            <div className="px-3 py-3 mb-3 border rounded">
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
      return (
        <Fragment>
          <DesktopViewSongsList songs={songs} />
          <MobileViewSongsList songs={songs} />
        </Fragment>
      );
    } else {
      return (
        <div className="mt-3">
          <h4>No songs found</h4>
        </div>
      );
    }
  };

  if (props.book) {
    return (
      <div>
        <Button type="button" onClick={onClickGoBack}>
          Go Back
        </Button>

        <div className="mt-4 d-flex align-items-center">
          <h2 className="text-tertiary">{props.book.name}</h2>
          <h4>
            <Badge className="ms-3" bg="tertiary">
              {getBookLang()}
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
