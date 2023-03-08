import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import { Book } from "@app-types/entities/books";
import { BookSelector } from "./components/book-selector";
import { SongSelector } from "./components/song-selector";
import { useSearchParams } from "react-router-dom";
import { uiSearchParams } from "@components/header/uiSearchParams";
import { bookService } from "@services/books";

export const Songs = () => {
  const [searchParams] = useSearchParams();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  /**
   * Retrieves the list of books and sets the selected book if
   * available within the URL.
   */
  useEffect(() => {
    const getBooks = async () => {
      let booksList = await bookService.getAllBooks();

      if (booksList) {
        // Sorts books by name
        booksList = booksList.sort((bookOne, bookTwo) => {
          if (bookOne.name > bookTwo.name) {
            return 1;
          } else if (bookOne.name < bookTwo.name) {
            return -1;
          } else {
            return 0;
          }
        });

        // Sets the selected book if a book id is found within the URL
        const urlBookId = searchParams.get(uiSearchParams.book);
        const tempBook = booksList.find((book) => book._id === urlBookId);
        if (tempBook) {
          setSelectedBook(tempBook);
        }
      }

      setBooks(booksList || []);
    };

    getBooks();
  }, []);

  return (
    <Container className="py-5">
      <BookSelector
        books={books}
        setSelectedBook={setSelectedBook}
        visible={!selectedBook}
      />
      <SongSelector book={selectedBook} setSelectedBook={setSelectedBook} />
    </Container>
  );
};
