import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import { uiSearchParams } from "@components/header/uiSearchParams";
import { authService } from "@services/auth";
import { bookService } from "@services/books";
import { songsService } from "@services/songs";
import { SongView } from "@views/songs/components/song-view";
import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import { useSearchParams } from "react-router-dom";
import { SongsListView } from "@views/songs/components/song-selector/components/songs-list-view";

export const Favorites = () => {
  const userInfo = authService.userInfo;
  const [searchParams, setSearchParams] = useSearchParams();
  const [favoriteSongs, setFavoriteSongs] = useState<Song[] | null>(null);
  const [books, setBooks] = useState<Book[] | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const attemptedAPIRequest = useRef<boolean>(false);

  useEffect(() => {
    if (!attemptedAPIRequest.current) {
      attemptedAPIRequest.current = true;
      getBooks();
    }
  }, []);

  const getFavoriteSongs = async () => {
    const songs = await songsService.getAllFavoriteSongs();
    setFavoriteSongs(songs);
  };

  const getBooks = async () => {
    let booksList = await bookService.getAllBooks();

    if (booksList) {
      // Sets the selected book if a book id is found within the URL
      const urlBookId = searchParams.get(uiSearchParams.book);
      const tempBook = bookService.findBookById(booksList, urlBookId);

      if (tempBook) {
        setSelectedBook(tempBook);
      }
    }

    await getFavoriteSongs();

    setBooks(booksList || []);
  };

  /**
   * Creates a text in title case form.
   * (First letter is capitalized and the rest are
   * lowercased).
   * @param text The text to title case
   */
  const titleCase = (text: string): string => {
    if (text.length === 0) {
      return "";
    } else if (text.length === 1) {
      return text.toLocaleUpperCase();
    } else {
      return text[0]?.toLocaleUpperCase() + text.slice(1).toLocaleLowerCase();
    }
  };

  /**
   * Handles clicking a song.
   * @param song The song the user selected
   */
  const onSongClick = (song: Song) => () => {
    const songBook = bookService.findBookById(books, song.catId);

    if (songBook) {
      searchParams.set(uiSearchParams.book, song._id);
      setSelectedBook(songBook);
    }

    searchParams.set(uiSearchParams.song, song._id);
    setSearchParams(searchParams);

    setSelectedSong(song);
  };

  if (userInfo) {
    // Shows the selected song's verses
    if (selectedBook && selectedSong) {
      return (
        <Container className="py-5">
          <SongView
            book={selectedBook}
            song={selectedSong}
            setSelectedSong={setSelectedSong}
            isSongAFavorite={true} // REPLACE THIS IN FUTURE
          />
        </Container>
      );
    }
    // Shows the user's favorite songs
    else if (books) {
      if (favoriteSongs && favoriteSongs.length > 0) {
        return (
          <Container className="py-5">
            <h1>
              Welcome home, {titleCase(userInfo.firstName)}&nbsp;
              {titleCase(userInfo.lastName)}
            </h1>

            <SongsListView
              songs={favoriteSongs}
              books={books}
              onSongClick={onSongClick}
            />
          </Container>
        );
      } else {
        return (
          <div className="mt-3">
            <h4>No songs found</h4>
          </div>
        );
      }
    }
  }

  return <></>;
};
