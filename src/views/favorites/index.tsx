import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import { uiSearchParams } from "@components/header/uiSearchParams";
import { bookService } from "@services/books";
import { songsService } from "@services/songs";
import { SongView } from "@views/songs/components/song-view";
import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import { useSearchParams } from "react-router-dom";
import { SongsListView } from "@views/songs/components/song-selector/components/songs-list-view";
import Placeholder from "react-bootstrap/Placeholder";
import Col from "react-bootstrap/Col";

export const Favorites = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [favoriteSongs, setFavoriteSongs] = useState<Song[] | null>(null);
  const [books, setBooks] = useState<Book[] | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const attemptedAPIRequest = useRef<boolean>(false);

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
   * Retrieves the list of the user's favorite songs after they finished
   * viewing a song. This is due to the possibility of the user removing
   * a song as their favorite while they were viewing it.
   */
  useEffect(() => {
    if (!selectedSong && books) {
      getFavoriteSongs();
    }
  }, [selectedSong]);

  /**
   * Retrieves the list of the user's favorite songs.
   */
  const getFavoriteSongs = async () => {
    const songsList = await songsService.getAllFavoriteSongs();
    setFavoriteSongs(songsList);

    // Sets the selected song if a song id is found within the URL
    if (songsList) {
      const urlSongId = searchParams.get(uiSearchParams.song);
      const tempSong = songsService.findSongById(songsList, urlSongId);

      if (!tempSong) {
        resetSearchParams();
      }

      setSelectedSong(tempSong);
    }
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
   * The JSX of the user's favorite songs.
   */
  const favoriteSongsListJSX = () => {
    if (books && favoriteSongs && favoriteSongs.length > 0) {
      return (
        <SongsListView
          songs={favoriteSongs}
          books={books}
          onSongClick={onSongClick}
        />
      );
    } else {
      return <h4 className="mt-3">No songs found</h4>;
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
