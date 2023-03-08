import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Placeholder from "react-bootstrap/Placeholder";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { Book } from "@app-types/entities/books";
import { useSearchParams } from "react-router-dom";
import { uiSearchParams } from "@components/header/uiSearchParams";
import "./index.scss";

type BookSelectorProps = {
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

      searchParams.set(uiSearchParams.book, book._id);
      setSearchParams(searchParams);
      props.setSelectedBook(book);
    };

  /**
   * Creates a book list item.
   * @param book The book info
   */
  const bookListItemJSX = (book: Book) => {
    return (
      <Col className="px-2 py-2 mb-1">
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
            <Button type="button" onClick={onBookClick(book)}>
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
          {[1, 2, 3].map(() => {
            return (
              <Col className="px-2 py-2 mb-1">
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
          {props.books.map((book) => {
            // Returns books that are both kreyol and french
            if (
              selectedTab === tabKeys.kreyolFrench &&
              book.lang === tabKeys.kreyolFrench
            ) {
              return bookListItemJSX(book);
            }

            // Returns french books
            else if (
              selectedTab === tabKeys.french &&
              book.lang === tabKeys.french
            ) {
              return bookListItemJSX(book);
            }

            // Returns kreyol books
            else if (
              selectedTab === tabKeys.kreyol &&
              book.lang === tabKeys.kreyol
            ) {
              return bookListItemJSX(book);
            }

            return <></>;
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
        onSelect={onTabSelect}
      >
        <Tab eventKey={tabKeys.french} title="French">
          {getBooksListJSX()}
        </Tab>
        <Tab eventKey={tabKeys.kreyol} title="Kreyol">
          {getBooksListJSX()}
        </Tab>
        <Tab eventKey={tabKeys.kreyolFrench} title="Kreyol and French">
          {getBooksListJSX()}
        </Tab>
      </Tabs>
    </div>
  );
};
