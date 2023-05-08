import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Verse } from "@app-types/entities/verses";
import { useContext, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { bookService } from "@services/books";
import { emailService } from "@services/email";
import { textFileService } from "@services/text-file";
import { wordDocService } from "@services/word-doc";
import { powerPointService } from "@services/power-point";
import { slideshowService } from "@services/slideshow";
import { userContext } from "@context/user";

type SongViewHeaderProps = {
  song: Song;
  book: Book;
  verses: Verse[] | null;
  show: boolean;
  setShowFavUpdateFailAlert: React.Dispatch<React.SetStateAction<boolean>>;
  resetFavoriteUpdateFailAlert: () => void;
};

export const SongViewHeader = (props: SongViewHeaderProps) => {
  const [updatingFavStatus, setUpdatingFavStatus] = useState(false);
  const [showFavortiesButtonTooltip, setShowFavortiesButtonTooltip] =
    useState(false);
  const [isSongAFavorite, setIsSongAFavorite] = useState(false);
  const userConsumer = useContext(userContext);

  /**
   * Retrieves the updated status of the song as a favorite
   */
  useEffect(() => {
    setIsSongAFavorite(userConsumer.methods.isSongAFavorite(props.song));
  }, [props.song, updatingFavStatus, userConsumer.state.favoriteSongs]);

  /**
   * Sends an email of the selected song using the user's mail client.
   */
  const onSendEmailClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (props.verses) {
      emailService.createTextFileFromSong(props.book, props.song, props.verses);
    }
  };

  /**
   * Downloads a text file of the song.
   */
  const onDownloadTextClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (props.verses) {
      textFileService.createTextFileFromSong(
        props.book,
        props.song,
        props.verses
      );
    }
  };

  /**
   * Downloads the song as a word document.
   */
  const onDownloadWordClick = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (props.verses) {
      await wordDocService.createWordDocumentFromSong(
        props.book,
        props.song,
        props.verses
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

    if (props.verses) {
      powerPointService.createPowerPointFromSong(
        props.book,
        props.song,
        props.verses
      );
    }
  };

  /**
   * Adds a song to the user's list of favorites.
   */
  const addFavoriteSong = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (userConsumer.state.user && !updatingFavStatus) {
      props.resetFavoriteUpdateFailAlert();

      setUpdatingFavStatus(true);
      const addedSong = await userConsumer.methods.addFavoriteSong(props.song);
      setUpdatingFavStatus(false);

      props.setShowFavUpdateFailAlert(!addedSong);
    }
  };

  /**
   * Removes a song from the user's list of favorites.
   */
  const removeFavoriteSong = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (userConsumer.state.user && props.song && !updatingFavStatus) {
      props.resetFavoriteUpdateFailAlert();

      setUpdatingFavStatus(true);
      const removedSong = await userConsumer.methods.removeFavoriteSong(
        props.song
      );
      setUpdatingFavStatus(false);

      props.setShowFavUpdateFailAlert(!removedSong);
    }
  };

  /**
   * Presents the song in a slideshow.
   */
  const openSlideshow = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();

    if (props.verses) {
      slideshowService.loadSongIntoSlideshow(props.verses, props.song);
      slideshowService.openSlideshow();
    }
  };

  /**
   * Toggle handler of the tooltip that displays for the favorites
   * button if the user isn't signed in.
   * @param nextShow Determines if the tooltip will hide or disappear next
   */
  const onFavoritesButtonTooltipToggle = (nextShow: boolean) => {
    if (!userConsumer.state.user) {
      setShowFavortiesButtonTooltip(nextShow);
    }
  };

  if (props.show) {
    return (
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        {/* The given book name and language */}
        <div className="mt-4 d-flex align-items-center">
          <h2 className="mb-0 text-tertiary">{props.book.name}</h2>
          <h4 className="mb-0">
            <Badge className="ms-3" bg="tertiary">
              {bookService.getBookLanguage(props.book)}
            </Badge>
          </h4>
        </div>

        <div className="mt-2 mt-md-4">
          {/* Add or Remove from favorites button */}
          <OverlayTrigger
            placement="auto"
            onToggle={onFavoritesButtonTooltipToggle}
            overlay={
              <Tooltip>
                {!userConsumer.state.user
                  ? "Log in to add this song as a favorite"
                  : ""}
              </Tooltip>
            }
            show={showFavortiesButtonTooltip}
          >
            <Button
              className="mt-3 mt-md-0 me-3"
              type="button"
              onClick={isSongAFavorite ? removeFavoriteSong : addFavoriteSong}
              aria-disabled={!userConsumer.state.user || updatingFavStatus}
            >
              {isSongAFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </OverlayTrigger>

          {/* Email button */}
          <Button
            className="mt-3 mt-md-0 me-3"
            type="button"
            onClick={onSendEmailClick}
          >
            Email
          </Button>

          {/* Download button and dropdown */}
          <Dropdown className="d-inline-block">
            <Dropdown.Toggle className="mt-3 mt-md-0 me-3" variant="primary">
              Download
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={onDownloadTextClick}>Text</Dropdown.Item>
              <Dropdown.Item onClick={onDownloadWordClick}>Word</Dropdown.Item>
              <Dropdown.Item onClick={onDownloadPowerPointClick}>
                PowerPoint
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Present button */}
          <Button
            className="mt-3 mt-md-0"
            type="button"
            onClick={openSlideshow}
          >
            Present
          </Button>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
