import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Placeholder from "react-bootstrap/Placeholder";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { Book } from "@app-types/entities/books";
import { useSearchParams } from "react-router-dom";
import { uiSearchParams } from "@components/header/uiSearchParams";
import "./index.scss";
import { bookService } from "@services/books";

type BookSelectorProps = {
  selectedBook: Book | null;
  setSelectedBook: (book: Book) => void;
  visible: boolean;
  books: Book[] | null;
  loadingBooks: boolean;
};

export const BookSelector = (props: BookSelectorProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabKeys = {
    french: "fr",
    kreyol: "kr",
    kreyolFrench: "kr-fr",
  };
  const [selectedTab, setSelectedTab] = useState(tabKeys.french);

  /**
   * Sets the selected language tab upon page refresh if a book
   * was selected during the initial render of the parent component.
   */
  useEffect(() => {
    if (props.selectedBook) {
      const tempBook = props.selectedBook;
      const bookLanguageKey = Object.values(tabKeys).find(
        (key) => key === tempBook.lang
      );

      if (bookLanguageKey) {
        onTabSelect(bookLanguageKey);
      }
    }
  }, [props.selectedBook]);

  /**
   * Sets the new selected tab key.
   * @param key The selected tab key
   */
  const onTabSelect = (key: string | null) => {
    setSelectedTab(key || tabKeys.french);
  };

  /**
   * Handles the selection of a book.
   * @param book The book the user selected
   * @param event The mouse click event
   */
  const onBookClick =
    (book: Book) =>
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();

      props.setSelectedBook(book);
      searchParams.set(uiSearchParams.book, book._id);
      setSearchParams(searchParams);
    };

  /**
   * Creates a book list item.
   * @param book The book info
   */
  const bookListItemJSX = (book: Book) => {
    return (
      <Col className="px-2 py-2 mb-1" key={book._id}>
        <div className="book-list-item px-3 py-3 d-flex flex-wrap justify-content-between border rounded">
          <Col
            className="book-list-item-text d-flex flex-column justify-content-between"
            xs={9}
          >
            <div>
              <h5 className="mb-0 text-primary">{book.name}</h5>
              <h6 className="mb-3">({book.abbrv})</h6>
            </div>
            <div>
              <h6 className="mb-0">{book.numOfSongs} Songs</h6>
            </div>
          </Col>
          <Col
            className="book-list-item-btn d-flex justify-content-end align-items-center"
            xs={3}
          >
            <Button
              type="button"
              onClick={onBookClick(book)}
              aria-label={`Open the book ${
                book.name
              } ${bookService.getBookLanguage(book)}`}
            >
              Open
            </Button>
          </Col>
        </div>
      </Col>
    );
  };

  /**
   * Creates a book list depending on selected book language.
   */
  const getBooksListJSX = () => {
    if (props.loadingBooks) {
      return (
        <Row xs={1} md={3}>
          {[1, 2, 3].map((num) => {
            return (
              <Col className="px-2 py-2 mb-1" key={num}>
                <div className="px-3 py-3 border rounded">
                  <Placeholder animation="glow">
                    <Placeholder xs={8} />
                    <Placeholder className="d-block" xs={2} />
                    <Placeholder className="mt-3 d-block" xs={3} />
                  </Placeholder>
                </div>
              </Col>
            );
          })}
        </Row>
      );
    } else if (props.books) {
      return (
        <Row xs={1} md={2} lg={3}>
          {props.books
            .filter((book) => book.lang === selectedTab)
            .map((book) => {
              // Only returns JSX for books that are the selected language(s)
              return bookListItemJSX(book);
            })}
        </Row>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div className={props.visible ? "view-songs" : "d-none"}>
      <h2 className="text-tertiary">Books</h2>

      <Tabs
        id="book-type-tabs"
        className="my-4"
        defaultActiveKey={selectedTab}
        activeKey={selectedTab}
        onSelect={onTabSelect}
      >
        <Tab eventKey={tabKeys.french} title="Français">
          {getBooksListJSX()}
        </Tab>
        <Tab eventKey={tabKeys.kreyol} title="Kréyol">
          {getBooksListJSX()}
        </Tab>
        <Tab eventKey={tabKeys.kreyolFrench} title="Kréyol and Français">
          {getBooksListJSX()}
        </Tab>
      </Tabs>
    </div>
  );
};
