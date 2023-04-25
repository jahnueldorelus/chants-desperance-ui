import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import { bookService } from "@services/books";
import Badge from "react-bootstrap/Badge";
import { useSearchParams } from "react-router-dom";
import { uiSearchParams } from "@components/header/uiSearchParams";
import Button from "react-bootstrap/Button";
import { Verse } from "@app-types/entities/verses";
import { useEffect, useRef, useState } from "react";
import { versesService } from "@services/verses";
import Placeholder from "react-bootstrap/Placeholder";
import Dropdown from "react-bootstrap/Dropdown";
import Col from "react-bootstrap/Col";
import { emailService } from "@services/email";
import { textFileService } from "@services/text-file";
import { wordDocService } from "@services/word-doc";
import { powerPointService } from "@services/power-point";
import { slideshowService } from "@services/slideshow";
import { songsService } from "@services/songs";

type SongViewProps = {
  book: Book | null;
  song: Song | null;
  setSelectedSong: (song: Song | null) => void;
};

export const SongView = (props: SongViewProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [songIsAFavorite, setSongIsAFavorite] = useState(false);
  const [updatingFavStatus, setUpdatingFavStatus] = useState(false);
  const fetchingVersesData = useRef(false);

  useEffect(() => {
    getVerses();
  }, [props.song]);

  /**
   * Updates the song's position as a user favorite after a modification is made
   * to its standing as a favorite song.
   */
  useEffect(() => {
    if (props.song) {
      setSongIsAFavorite(songsService.isSongAFavorite(props.song));
    }
  }, [updatingFavStatus]);

  /**
   * Retrieves the list of verses in the selected song if available and
   * determines if the song is a user favorite.
   */
  const getVerses = async () => {
    if (props.song && !fetchingVersesData.current) {
      setLoadingVerses(true);
      fetchingVersesData.current = true;

      let versesList = await versesService.getVerses(props.song._id);
      if (versesList) {
        // Sorts verses by number
        versesList = versesList.sort(
          (verseOne, verseTwo) =>
            parseInt(verseOne.verseNum) - parseInt(verseTwo.verseNum)
        );
      }

      setVerses(versesList);
      setLoadingVerses(false);
      fetchingVersesData.current = false;
      setSongIsAFavorite(songsService.isSongAFavorite(props.song));
    } else {
      // Resets the list of verses when there's no selected song
      setVerses(null);
    }
  };

  /**
   * Removes the selected song to allow the user to choose another one.
   * @param event The mouse click event
   */
  const onClickGoBack = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    searchParams.delete(uiSearchParams.song);
    setSearchParams(searchParams);
    props.setSelectedSong(null);
  };

  /**
   * Adds a song to the user's list of favorites.
   */
  const addFavoriteSong = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (props.song && !updatingFavStatus) {
      setUpdatingFavStatus(true);
      await songsService.addFavoriteSong(props.song);
      setUpdatingFavStatus(false);
    }
  };

  /**
   * Removes a song from the user's list of favorites.
   */
  const removeFavoriteSong = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (props.song && !updatingFavStatus) {
      setUpdatingFavStatus(true);
      await songsService.removeFavoriteSong(props.song);
      setUpdatingFavStatus(false);
    }
  };

  /**
   * Sends an email of the selected song using the user's mail client.
   */
  const onSendEmailClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (props.book && props.song && verses) {
      emailService.createTextFileFromSong(props.book, props.song, verses);
    }
  };

  /**
   * Downloads a text file of the song.
   */
  const onDownloadTextClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (props.book && props.song && verses) {
      textFileService.createTextFileFromSong(props.book, props.song, verses);
    }
  };

  /**
   * Downloads the song as a word document.
   */
  const onDownloadWordClick = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (props.book && props.song && verses) {
      await wordDocService.createWordDocumentFromSong(
        props.book,
        props.song,
        verses
      );
    }
  };

  /**
   * Downloads the song as a powerpoint.
   */
  const onDownloadPowerPointClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (props.book && props.song && verses) {
      powerPointService.createPowerPointFromSong(
        props.book,
        props.song,
        verses
      );
    }
  };

  /**
   * Presents the song in a slideshow.
   */
  const openSlideshow = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();

    if (props.song && verses) {
      slideshowService.loadSongIntoSlideshow(verses, props.song);
      slideshowService.openSlideshow();
    }
  };

  // If the verses of the song are loading
  if (props.book && props.song) {
    if (loadingVerses) {
      return (
        <div>
          <Button type="button" onClick={onClickGoBack}>
            Go Back
          </Button>

          <Col className="mt-3" xs={4}>
            <div className="py-3 mb-3">
              <div>
                <Placeholder animation="glow">
                  <Placeholder xs={12} />
                  <Placeholder className="d-block" xs={4} />
                  <Placeholder className="mt-3 d-block" xs={6} />
                </Placeholder>
              </div>
            </div>
          </Col>

          <Col className="mt-3" md={5}>
            <div className="px-3 py-3 border rounded">
              {[1, 2, 3].map((num) => (
                <Placeholder animation="glow" key={num}>
                  <Placeholder xs={12} />
                  <Placeholder className="d-block" xs={5} />
                  <Placeholder className="mt-1 mb-2 d-block" xs={8} />
                </Placeholder>
              ))}
            </div>
          </Col>
        </div>
      );
    }

    // If the verses of the sond are available
    else if (verses) {
      const song = props.song;
      const book = props.book;

      return (
        <div>
          <Button type="button" onClick={onClickGoBack}>
            Go Back
          </Button>

          <div className="mt-4 d-flex flex-wrap justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <h2 className="mb-0 text-tertiary">{book.name}</h2>
              <h4 className="mb-0">
                <Badge className="ms-3" bg="tertiary">
                  {bookService.getBookLanguage(book)}
                </Badge>
              </h4>
            </div>

            <div>
              <Button
                className="mt-3 mt-md-0 me-3"
                type="button"
                onClick={songIsAFavorite ? removeFavoriteSong : addFavoriteSong}
                aria-disabled={updatingFavStatus}
              >
                {songIsAFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>

              <Button
                className="mt-3 mt-md-0 me-3"
                type="button"
                onClick={onSendEmailClick}
              >
                Email
              </Button>
              <Dropdown className="d-inline-block">
                <Dropdown.Toggle
                  className="mt-3 mt-md-0 me-3"
                  variant="primary"
                >
                  Download
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={onDownloadTextClick}>
                    Text
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onDownloadWordClick}>
                    Word
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onDownloadPowerPointClick}>
                    PowerPoint
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                className="mt-3 mt-md-0"
                type="button"
                onClick={openSlideshow}
              >
                Present
              </Button>
            </div>
          </div>

          <div className="mt-4 border rounded overflow-hidden">
            <div className="px-3 py-3 bg-primary text-secondary">
              <h5 className="mb-0">
                #{song.bookNum}&nbsp;{song.name}
              </h5>
            </div>

            <div className="px-3 pb-4 text-center">
              {verses.map((item) => (
                <div className="mt-4" key={item._id}>
                  <h6>{versesService.getVerseNumber(item, song)}</h6>
                  {item.verse.split("\n").map((verse, index) => (
                    <h6 key={index}>{verse}</h6>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }

  return <></>;
};
