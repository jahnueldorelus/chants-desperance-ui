import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import { uiSearchParams } from "@components/header/uiSearchParams";
import { bookService } from "@services/books";
import { SongView } from "@views/songs/components/song-view";
import {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
  MouseEvent,
} from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Link, useSearchParams } from "react-router-dom";
import { SongsListView } from "@views/songs/components/song-selector/components/songs-list-view";
import Placeholder from "react-bootstrap/Placeholder";
import Col from "react-bootstrap/Col";
import { userContext } from "@context/user";
import { uiRoutes } from "@components/header/uiRoutes";

export const Favorites = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[] | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [failedToGetFavoriteSongs, setFailedToGetFavoriteSongs] =
    useState(false);
  const attemptedAPIRequest = useRef<boolean>(false);
  const userConsumer = useContext(userContext);

  /**
   * Retrieves the list of books and the user's favorite songs.
   */
  useEffect(() => {
    if (!attemptedAPIRequest.current) {
      attemptedAPIRequest.current = true;
      getBooks();
    }
  }, []);

  /**
   * Retrieves the list of the user's favorite songs.
   */
  const getFavoriteSongs = async () => {
    setLoadingData(true);

    if (failedToGetFavoriteSongs) {
      setFailedToGetFavoriteSongs(false);
    }

    const retrievedFavoriteSongs =
      await userConsumer.methods.getFavoriteSongs();

    // Sets the selected song if a song id is found within the URL
    if (retrievedFavoriteSongs) {
      const urlSongId = searchParams.get(uiSearchParams.song) || "";
      const tempSong = userConsumer.methods.getFavoriteSongById(urlSongId);

      if (!tempSong) {
        resetSearchParams();
      }

      setSelectedSong(tempSong);
    } else {
      setFailedToGetFavoriteSongs(true);
    }

    setLoadingData(false);
  };

  /**
   * Retrieves the list of books.
   */
  const getBooks = async () => {
    setLoadingData(true);
    let booksList = await bookService.getAllBooks();

    // Sets the selected book if a book id is found within the URL
    if (booksList) {
      const urlBookId = searchParams.get(uiSearchParams.book);
      const tempBook = bookService.findBookById(booksList, urlBookId);

      if (!tempBook) {
        resetSearchParams();
      }

      setSelectedBook(tempBook);
    }

    await getFavoriteSongs();

    setBooks(booksList || []);
    setLoadingData(false);
  };

  /**
   * Removes the book and song id from the url if they're there.
   */
  const resetSearchParams = () => {
    searchParams.delete(uiSearchParams.book);
    searchParams.delete(uiSearchParams.song);
    setSearchParams(searchParams);
  };

  /**
   * Handles clicking a song.
   * @param song The song the user selected
   */
  const onSongClick = (song: Song) => () => {
    const songBook = bookService.findBookById(books, song.catId);

    if (songBook) {
      searchParams.set(uiSearchParams.book, songBook._id);
      setSelectedBook(songBook);
    }

    searchParams.set(uiSearchParams.song, song._id);
    setSearchParams(searchParams);

    setSelectedSong(song);
  };

  /**
   * Click handler for refetching the user's favorites songs.
   */
  const onRefetchFavoritesClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    await getFavoriteSongs();
  };

  /**
   * The JSX of the user's favorite songs.
   */
  const favoriteSongsListJSX = () => {
    if (books && userConsumer.state.favoriteSongs.size > 0) {
      // The user's list of favorite songs (sorted by book and song number)
      const favoriteSongs = [...userConsumer.state.favoriteSongs.values()].sort(
        (a, b) => {
          const bookSort = a.catId < b.catId ? -1 : a.catId > b.catId ? 1 : 0;
          const bookNumSort =
            a.bookNum < b.bookNum ? -1 : a.bookNum > b.bookNum ? 1 : 0;

          return bookSort !== 0 ? bookSort : bookNumSort;
        }
      );

      return (
        <SongsListView
          songs={favoriteSongs}
          books={books}
          onSongClick={onSongClick}
        />
      );
    } else {
      return (
        <Fragment>
          {!failedToGetFavoriteSongs && (
            <h4 className="mt-3">
              No songs were found. Head over to the&nbsp;
              <Link className="text-tertiary" to={uiRoutes.songs}>
                songs
              </Link>
              &nbsp;page to add a song to your list of favorites.
            </h4>
          )}
          <Alert
            className="px-3 py-2 my-4 d-flex w-fit"
            show={failedToGetFavoriteSongs}
            variant="danger"
          >
            <p className="m-0">
              An error occurred retrieving your favorite songs. Click the button
              below to try again.
            </p>
          </Alert>

          {failedToGetFavoriteSongs && (
            <Button onClick={onRefetchFavoritesClick} type="button">
              Get Favorites Songs
            </Button>
          )}
        </Fragment>
      );
    }
  };

  // Shows the selected song's verses
  if (loadingData) {
    return (
      <Container className="py-5">
        <h2 className="text-tertiary">Favorites</h2>

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
      </Container>
    );
  } else if (selectedBook && selectedSong) {
    return (
      <Container className="py-5">
        <SongView
          book={selectedBook}
          song={selectedSong}
          setSelectedSong={setSelectedSong}
        />
      </Container>
    );
  }
  // Shows the user's favorite songs
  else if (books) {
    return (
      <Container className="py-5">
        <h2 className="text-tertiary">Favorites</h2>

        {favoriteSongsListJSX()}
      </Container>
    );
  } else {
    return <></>;
  }
};
