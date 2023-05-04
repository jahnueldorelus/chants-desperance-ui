import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import { useSearchParams } from "react-router-dom";
import { uiSearchParams } from "@components/header/uiSearchParams";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Verse } from "@app-types/entities/verses";
import { useContext, useEffect, useRef, useState } from "react";
import { versesService } from "@services/verses";
import { userContext } from "@context/user";
import { SongViewHeader } from "./components/header";
import { SongViewLoader } from "./components/loader";
import { SongViewBody } from "./components/body";

type SongViewProps = {
  book: Book | null;
  song: Song | null;
  setSelectedSong: (song: Song | null) => void;
};

export const SongView = (props: SongViewProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [showFavUpdateFailAlert, setShowFavUpdateFailAlert] = useState(false);
  const fetchingVersesData = useRef(false);
  const alertTimeout = useRef<NodeJS.Timeout>();
  const userConsumer = useContext(userContext);

  /**
   * Retrieves the list of verses of a song whenever a new song
   * is given. Also, if there's no longer a song available, the component
   * is cleaned up.
   */
  useEffect(() => {
    if (props.song) {
      getVerses();
    } else {
      resetFavoriteUpdateFailAlert();
    }
  }, [props.song]);

  /**
   * Handles showing an alert to the user that updating the song's
   * status as a favorite failed.
   */
  useEffect(() => {
    if (showFavUpdateFailAlert) {
      alertTimeout.current = setTimeout(() => {
        resetFavoriteUpdateFailAlert();
      }, 4000);
    }

    return () => {
      clearTimeout(alertTimeout.current);
    };
  }, [showFavUpdateFailAlert]);

  /**
   * Resets the alert for a failed song modification as a favorite.
   */
  const resetFavoriteUpdateFailAlert = () => {
    clearTimeout(alertTimeout.current);
    setShowFavUpdateFailAlert(false);
  };

  /**
   * Retrieves the list of verses in the selected song if available.
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

  // If the verses of the song are loading
  if (props.book && props.song) {
    const isSongAFavorite = userConsumer.methods.isSongAFavorite(props.song);

    return (
      <div>
        <Button type="button" onClick={onClickGoBack}>
          Go Back
        </Button>

        <Alert
          className="px-3 py-2 mt-4 d-flex w-fit"
          show={showFavUpdateFailAlert}
          variant="danger"
        >
          <p className="m-0">{`An error occurred ${
            isSongAFavorite ? "removing" : "adding"
          } the song as a favorite`}</p>
        </Alert>

        <SongViewLoader show={loadingVerses} />

        <SongViewHeader
          book={props.book}
          song={props.song}
          verses={verses}
          show={!loadingVerses && !!verses}
          resetFavoriteUpdateFailAlert={resetFavoriteUpdateFailAlert}
          setShowFavUpdateFailAlert={setShowFavUpdateFailAlert}
        />

        <SongViewBody song={props.song} verses={verses} show={!loadingVerses} />
      </div>
    );
  } else {
    return <></>;
  }
};
