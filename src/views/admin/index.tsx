import { uiRoutes } from "@components/header/uiRoutes";
import { userContext } from "@context/user";
import { useContext, useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Placeholder from "react-bootstrap/Placeholder";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { bookService } from "@services/books";
import { Book } from "@app-types/entities/books";
import {
  AddOrUpdateSongInfo,
  AddOrUpdateSongVerse,
} from "@app-types/services/songs";
import { Song } from "@app-types/entities/songs";
import { songsService } from "@services/songs";
import { Verse } from "@app-types/entities/verses";
import { versesService } from "@services/verses";
import { EditVerses } from "./component/edit-verses";
import { UpdateOrAddSongHeader } from "./component/update-or-add-song-header";
import Form from "react-bootstrap/Form";
import { DeleteSongInfo } from "@app-types/services/songs";

export const Admin = () => {
  const newVersePrefix = "new-verse-";
  const newSongInfoDefaultValue: Song = {
    _id: "",
    bookNum: -1,
    catId: "",
    hasChorus: false,
    lang: "" as "kr" | "fr",
    name: "",
    numOfVerses: 0,
    searchName: "",
  };

  const navigate = useNavigate();
  const [addingASong, setAddingASong] = useState(false);
  const [availableBooks, setAvailableBooks] = useState<Book[] | null>(null);
  const [availableSongs, setAvailableSongs] = useState<Song[] | null>(null);
  const [newSongInfo, setNewSongInfo] = useState<Song>(newSongInfoDefaultValue);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [verseWithChorusExists, setVerseWithChorusExists] = useState(false);
  const [showVerseIsChorusTooltip, setShowVerseIsChorusTooltip] = useState(
    new Map<string, boolean>()
  );
  const [selectedSongVerses, setSelectedSongVerses] = useState<
    Map<string, Verse>
  >(new Map());
  const [addOrUpdateReqStatus, setAddOrUpdateReqStatus] = useState<
    boolean | null
  >(null);
  const [deleteReqStatus, setDeleteReqStatus] = useState<boolean | null>(null);
  const userConsumer = useContext(userContext);
  const fetchedBooks = useRef(false);

  /**
   * Determines if the user is authorized to view this page. If not,
   * they're sent to the home page.
   */
  useEffect(() => {
    if (userConsumer.state.user && !userConsumer.state.user.isAdmin) {
      navigate(uiRoutes.songs);
    }
  }, [userConsumer.state.user]);

  /**
   * Fetches the list of books available
   */
  useEffect(() => {
    if (!fetchedBooks.current) {
      fetchedBooks.current = true;
      getBooks();
    }
  }, []);

  /**
   * Removes the alert of passing or failing the request
   * to add or update a song after a few seconds.
   */
  useEffect(() => {
    let alertTimeout: NodeJS.Timeout;

    if (addOrUpdateReqStatus !== null) {
      alertTimeout = setTimeout(() => {
        setAddOrUpdateReqStatus(null);
      }, 4000);
    } else if (deleteReqStatus !== null) {
      alertTimeout = setTimeout(() => {
        setDeleteReqStatus(null);
      }, 4000);
    }

    return () => {
      if (alertTimeout) {
        clearTimeout(alertTimeout);
      }
    };
  }, [addOrUpdateReqStatus, deleteReqStatus]);

  /** Retrieves the list of songs for a selected book */
  useEffect(() => {
    if (addingASong) {
      setSelectedBook(null);
      setSelectedSong(null);
    }
    if (selectedBook) {
      getSongs();
    } else {
      setAvailableSongs(null);
    }

    // Resets the selected song since a change was made to the selected book
    setSelectedSong(null);
  }, [selectedBook, addingASong]);

  /** Retrieves the list of verses for a selected song */
  useEffect(() => {
    if (selectedSong) {
      getVerses();
    } else {
      setSelectedSongVerses(new Map());
      setNewSongInfo(newSongInfoDefaultValue);
      setShowVerseIsChorusTooltip(new Map());
      setVerseWithChorusExists(false);
    }
  }, [selectedSong]);

  /**
   * Resets all info by resetting specific data that will
   * trigger the "useEffect" hook to reset all data.
   */
  const resetAllInfo = () => {
    setAvailableSongs(null);
    setNewSongInfo(newSongInfoDefaultValue);
    setSelectedBook(null);
    setSelectedSong(null);
    setVerseWithChorusExists(false);
    setShowVerseIsChorusTooltip(new Map());
    setSelectedSongVerses(new Map());
  };

  /**
   * Attempts to retrieve the list of books.
   */
  const getBooks = async () => {
    setAvailableBooks(await bookService.getAllBooks());
  };

  /**
   * Attempts to retrieve the list of songs in a book.
   */
  const getSongs = async () => {
    if (selectedBook) {
      setAvailableSongs(await songsService.getSongsByBook(selectedBook._id));
    }
  };

  /**
   * Attempts to retrieve the list of verses in a song.
   */
  const getVerses = async () => {
    if (selectedSong) {
      const verses = await versesService.getVerses(selectedSong._id);

      if (verses) {
        let chorusExists = false;
        const tempVersesMap = new Map();
        const tempShowChorusToolTipMap = new Map();

        verses.forEach((verse) => {
          if (verse.isChorus) {
            chorusExists = true;
          }

          tempShowChorusToolTipMap.set(verse._id, false);
          tempVersesMap.set(verse._id, verse);
        });

        setVerseWithChorusExists(chorusExists);
        setSelectedSongVerses(tempVersesMap);
        setShowVerseIsChorusTooltip(tempShowChorusToolTipMap);
      }
    }
  };

  /**
   * Handles the click event of the switch that determines if the user is
   * editing or adding a song.
   */
  const onAddOrEditSongToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddingASong(!addingASong);
  };

  /**
   * Get the request status message of attempting to add or
   * update a song.
   */
  const getAddOrUpdateReqStatusMessage = () => {
    let statusMessage = "";

    if (addOrUpdateReqStatus) {
      statusMessage += "Successfully ";
      statusMessage += addingASong ? "added the song" : "updated song";
    } else {
      statusMessage += "Failed ";
      statusMessage += addingASong ? "adding the song" : "updating the song";
    }

    return statusMessage;
  };

  /**
   * Get the request status message of attempting to delete
   * a song.
   */
  const getDeleteReqStatusMessage = () => {
    let statusMessage = "";

    if (deleteReqStatus !== null) {
      statusMessage = deleteReqStatus
        ? "Successfully deleted the song"
        : "Failed to delete the song";
    }

    return statusMessage;
  };

  /**
   * Attempts to update or add song.
   * @param event The event of clicking a button
   */
  const updateOrAddSong = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (userConsumer.state.user) {
      let songUpdateInfo: AddOrUpdateSongInfo = {} as AddOrUpdateSongInfo;

      // For updating a song
      if (selectedBook && selectedSong && selectedSongVerses.size > 0) {
        songUpdateInfo = {
          songId: selectedSong._id,
          catId: newSongInfo.catId ? newSongInfo.catId : selectedBook._id,
          name: newSongInfo.name ? newSongInfo.name : selectedSong.name,
          searchName: newSongInfo.searchName
            ? newSongInfo.searchName
            : selectedSong.searchName,
          hasChorus: verseWithChorusExists,
          bookNum:
            newSongInfo.bookNum && newSongInfo.bookNum !== -1
              ? newSongInfo.bookNum
              : selectedSong.bookNum,
          numOfVerses: verseWithChorusExists
            ? selectedSongVerses.size - 1
            : selectedSongVerses.size,
          lang: newSongInfo.lang ? newSongInfo.lang : selectedSong.lang,
          verses: Array.from(selectedSongVerses, ([key, item]) => {
            const newVerseInfo: AddOrUpdateSongVerse = {
              isChorus: item.isChorus,
              verse: item.verse,
              // Minimum verse number is one
              verseNum: item.isChorus
                ? 1.5
                : Math.max(parseInt(item.verseNum), 1),
            };
            return newVerseInfo;
          }),
        };
      }

      // For adding a song
      else if (!selectedBook && !selectedSong && selectedSongVerses.size > 0) {
        songUpdateInfo = {
          songId: null,
          catId: newSongInfo.catId,
          name: newSongInfo.name,
          searchName: newSongInfo.searchName,
          hasChorus: verseWithChorusExists,
          bookNum: newSongInfo.bookNum,
          numOfVerses: verseWithChorusExists
            ? selectedSongVerses.size - 1
            : selectedSongVerses.size,
          lang: newSongInfo.lang,
          verses: Array.from(selectedSongVerses, ([key, item]) => {
            const newVerseInfo: AddOrUpdateSongVerse = {
              isChorus: item.isChorus,
              verse: item.verse,
              // Minimum verse number is one
              verseNum: item.isChorus
                ? 1.5
                : Math.max(parseInt(item.verseNum), 1),
            };
            return newVerseInfo;
          }),
        };
      }

      const apiReqPassed = await songsService.updateSong(
        userConsumer.state.user,
        songUpdateInfo
      );

      if (apiReqPassed) {
        setAddOrUpdateReqStatus(true);
        resetAllInfo();
      } else {
        setAddOrUpdateReqStatus(false);
      }
    }
  };

  /**
   * Attempts to delete a song.
   * @param event The event of clicking a button
   */
  const deleteSong = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (userConsumer.state.user && selectedSong) {
      event.preventDefault();

      const deleteSongInfo: DeleteSongInfo = {
        songId: selectedSong._id,
      };

      const apiReqPassed = await songsService.deleteSong(
        userConsumer.state.user,
        deleteSongInfo
      );

      if (apiReqPassed) {
        setDeleteReqStatus(true);
        resetAllInfo();
      } else {
        setDeleteReqStatus(false);
      }
    }
  };

  if (availableBooks) {
    return (
      <Container className="py-5">
        <h2 className="text-tertiary">Create/Edit Songs</h2>

        <div className="px-4 py-3">
          <Form.Check
            className="mb-2 d-flex align-items-center"
            type="switch"
            label={<h5 className="ms-2 mb-0">Add a Song</h5>}
            checked={addingASong}
            onChange={onAddOrEditSongToggle}
          />
          <Form.Check
            className="d-flex align-items-center"
            type="switch"
            label={<h5 className="ms-2 mb-0">Edit a Song</h5>}
            checked={!addingASong}
            onChange={onAddOrEditSongToggle}
          />
        </div>

        <div className="mt-2 border rounded overflow-hidden">
          <div className="px-3 py-3 bg-primary text-secondary">
            <h5 className="mb-0">{`${
              addingASong ? "Adding" : "Editing"
            } a Song`}</h5>
          </div>

          <div className="px-3 py-2">
            {/* Update or Add Song Header */}
            <UpdateOrAddSongHeader
              addingASong={addingASong}
              availableBooks={availableBooks}
              availableSongs={availableSongs}
              newSongInfo={newSongInfo}
              selectedBook={selectedBook}
              selectedSong={selectedSong}
              setNewSongInfo={setNewSongInfo}
              setSelectedSong={setSelectedSong}
              setSelectedBook={setSelectedBook}
            />

            {/* Verses Edit */}
            <EditVerses
              addingASong={addingASong}
              newVersePrefix={newVersePrefix}
              selectedSong={selectedSong}
              selectedSongVerses={selectedSongVerses}
              setSelectedSongVerses={setSelectedSongVerses}
              setShowVerseIsChorusTooltip={setShowVerseIsChorusTooltip}
              setVerseWithChorusExists={setVerseWithChorusExists}
              showVerseIsChorusTooltip={showVerseIsChorusTooltip}
              verseWithChorusExists={verseWithChorusExists}
            />
          </div>

          <Alert
            className="py-2 mt-3 mx-3"
            variant={
              addOrUpdateReqStatus !== null
                ? addOrUpdateReqStatus
                  ? "success"
                  : "danger"
                : ""
            }
            show={addOrUpdateReqStatus !== null}
          >
            {getAddOrUpdateReqStatusMessage()}
          </Alert>

          <Alert
            className="py-2 mt-3 mx-3"
            variant={
              deleteReqStatus !== null
                ? deleteReqStatus
                  ? "success"
                  : "danger"
                : ""
            }
            show={deleteReqStatus !== null}
          >
            {getDeleteReqStatusMessage()}
          </Alert>

          <div className="p-3 d-flex justify-content-end">
            {selectedSong && (
              <Button className="me-4 bg-danger border-0" onClick={deleteSong}>
                Delete Song
              </Button>
            )}
            {(!!selectedSong ||
              (addingASong && selectedSongVerses.size > 0)) && (
              <Button onClick={updateOrAddSong}>
                {addingASong ? "Add Song" : "Update Song"}
              </Button>
            )}
          </div>
        </div>
      </Container>
    );
  } else {
    return (
      <Container className="py-5">
        <h2 className="text-tertiary">Create/Edit Songs</h2>

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
      </Container>
    );
  }
};
