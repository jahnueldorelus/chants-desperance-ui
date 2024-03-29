import Container from "react-bootstrap/Container";
import { useEffect, useState, useRef } from "react";
import { Book } from "@app-types/entities/books";
import { BookSelector } from "@views/songs/components/book-selector";
import { SongSelector } from "@views/songs/components/song-selector";
import { SongView } from "@views/songs/components/song-view";
import { useSearchParams } from "react-router-dom";
import { uiSearchParams } from "@components/header/uiSearchParams";
import { bookService } from "@services/books";
import { Song } from "@app-types/entities/songs";
import { FocusableReference } from "@components/focusable-reference";

export const Songs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [books, setBooks] = useState<Book[] | null>(null);
  const loadingBooks = useRef(true);
  const attemptedAPIRequest = useRef(false);
  const topOfPageRef = useRef<HTMLDivElement>(null);

  /**
   * Retrieves the list of books and sets the selected book if
   * available within the URL.
   */
  useEffect(() => {
    if (!attemptedAPIRequest.current) {
      attemptedAPIRequest.current = true;
      getBooks();
    }
  }, []);

  /**
   * Sets the selected book if one is given in the url
   */
  useEffect(() => {
    getBookFromUrl();
  }, [books, searchParams]);

  // Sets the focus back to the page after the selected book or song changes.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (topOfPageRef.current) {
      topOfPageRef.current.focus();
    }
  }, [selectedBook, selectedSong]);

  /**
   * Retrieves the list of books.
   */
  const getBooks = async () => {
    let booksList = await bookService.getAllBooks();

    // Sorts books by name
    if (booksList) {
      booksList = booksList.sort((bookOne, bookTwo) => {
        if (bookOne.name > bookTwo.name) {
          return 1;
        } else if (bookOne.name < bookTwo.name) {
          return -1;
        } else {
          return 0;
        }
      });
    }

    setBooks(booksList || []);
    loadingBooks.current = false;
  };

  /**
   * Retrieves the selected book from the url if it exists.
   */
  const getBookFromUrl = () => {
    if (books) {
      const urlBookId = searchParams.get(uiSearchParams.book);

      if (!selectedBook || (!!selectedBook && selectedBook._id !== urlBookId)) {
        const tempBook = bookService.findBookById(books, urlBookId);

        if (!tempBook) {
          resetSearchParams();
        }

        setSelectedBook(tempBook);
      }
    }
  };

  /**
   * Removes the book and song id from the url if they're there.
   */
  const resetSearchParams = () => {
    searchParams.delete(uiSearchParams.book);
    searchParams.delete(uiSearchParams.song);
    setSearchParams(searchParams);
  };

  return (
    <Container className="py-5">
      <FocusableReference ref={topOfPageRef} />

      <BookSelector
        books={books}
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        visible={!selectedBook}
        loadingBooks={loadingBooks.current}
      />

      <SongSelector
        book={selectedBook}
        song={selectedSong}
        setSelectedBook={setSelectedBook}
        setSelectedSong={setSelectedSong}
      />

      <SongView
        book={selectedBook}
        song={selectedSong}
        setSelectedSong={setSelectedSong}
      />
    </Container>
  );
};
