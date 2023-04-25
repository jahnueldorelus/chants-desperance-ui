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

export const Favorites = () => {
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

  const getBooks = async () => {
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
          <h2 className="text-tertiary">Favorites</h2>

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
  } else {
    return <></>;
  }
};
