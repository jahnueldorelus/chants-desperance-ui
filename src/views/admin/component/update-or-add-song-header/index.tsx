import { Book } from "@app-types/entities/books";
import { Song } from "@app-types/entities/songs";
import Form from "react-bootstrap/Form";
import { bookService } from "@services/books";
import { Fragment } from "react";

type UpdateOrAddSongHeaderProps = {
  addingASong: boolean;
  selectedBook: Book | null;
  selectedSong: Song | null;
  availableBooks: Book[] | null;
  availableSongs: Song[] | null;
  newSongInfo: Song;
  setNewSongInfo: React.Dispatch<React.SetStateAction<Song>>;
  setSelectedSong: React.Dispatch<React.SetStateAction<Song | null>>;
  setSelectedBook: React.Dispatch<React.SetStateAction<Book | null>>;
};

export const UpdateOrAddSongHeader = (props: UpdateOrAddSongHeaderProps) => {
  /**
   * Handles the selection of a song.
   * @param event The event of selecting an option
   */
  const onSongSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();

    if (props.availableSongs) {
      const selectedSongId = event.target.value;
      const tempSelectedSong = props.availableSongs.find(
        (song) => song._id === selectedSongId
      );

      props.setSelectedSong(tempSelectedSong || null);
    }
  };

  /**
   * Handles the selection of a book.
   * @param event The event of selecting an option
   */
  const onBookSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();

    if (props.availableBooks) {
      const selectedBookId = event.target.value;
      const tempSelectedBook = props.availableBooks.find(
        (book) => book._id === selectedBookId
      );

      props.setSelectedBook(tempSelectedBook || null);
    }
  };

  /**
   * Handles the selection of a new book the song will move to.
   * @param event The event of selecting an option
   */
  const onNewSongBookSelected = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    event.preventDefault();

    props.setNewSongInfo({
      ...props.newSongInfo,
      catId: event.target.value,
    });
  };

  /**
   * Updates a song's number.
   * @param event The event of changing an input
   */
  const onSongNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const validSongNumber = parseInt(event.target.value);

    // Sets the new song number. Lowest number by default is 0
    const newSongNumber = Math.max(validSongNumber || 0, 0);
    props.setNewSongInfo({
      ...props.newSongInfo,
      bookNum: validSongNumber ? newSongNumber : -1,
    });
  };

  /**
   * Updates a song's name.
   * @param event The event of changing an input
   */
  const onSongNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    // Sets the new song name
    props.setNewSongInfo({ ...props.newSongInfo, name: event.target.value });
  };

  /**
   * Updates a song's search name.
   * @param event The event of changing an input
   */
  const onSongSearchNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    // Sets the new song name
    props.setNewSongInfo({
      ...props.newSongInfo,
      searchName: event.target.value,
    });
  };

  /**
   * Updates a song's language.
   * @param event The event of changing an input
   */
  const onSongLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    event.preventDefault();

    // Sets the new song language
    props.setNewSongInfo({
      ...props.newSongInfo,
      lang: event.target.value as "kr" | "fr",
    });
  };

  if (props.availableBooks) {
    return (
      <div className="d-flex flex-wrap align-items-end">
        {/* Book Selection */}
        {!props.addingASong && (
          <Fragment>
            <Form.Label className="my-2 me-4 text-tertiary w-fit " as="h5">
              Select Book
              <Form.Select
                className="mt-2"
                aria-label="Select the book the song that will be updated is in"
                value={props.selectedBook ? props.selectedBook._id : ""}
                onChange={onBookSelected}
              >
                <option value="">Select a book</option>
                {props.availableBooks.map((book) => {
                  const bookName = book.name;
                  const bookId = book._id;
                  const bookLang = bookService.getBookLanguage(book);

                  return (
                    <option
                      key={bookId}
                      value={bookId}
                    >{`${bookName} (${bookLang})`}</option>
                  );
                })}
              </Form.Select>
            </Form.Label>
            {/* Song Selection */}
            {props.availableSongs && props.selectedBook && (
              <Form.Label className="my-2 me-4 text-tertiary w-fit " as="h5">
                Select Song
                <Form.Select
                  className="mt-2"
                  aria-label={`Select a song from the selected book ${
                    props.selectedBook.name
                  } ${bookService.getBookLanguage(props.selectedBook)}`}
                  value={props.selectedSong?._id}
                  onChange={onSongSelected}
                >
                  <option value="">Select a song</option>
                  {props.availableSongs.map((song) => {
                    const songName = `${song.bookNum}) ${song.name}`;
                    const songId = song._id;

                    return (
                      <option value={songId} key={songId}>
                        {songName}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Label>
            )}
          </Fragment>
        )}

        {/* New Song Info */}
        {(props.addingASong || !!props.selectedSong) && (
          <div className="mt-3 d-flex flex-wrap align-items-end">
            <Form.Label className="my-2 me-4 text-tertiary" as="h5">
              New Song Book
              <Form.Select
                className="mt-2"
                aria-label="Select the book the song that will be updated is in"
                value={props.newSongInfo.catId ? props.newSongInfo.catId : ""}
                onChange={onNewSongBookSelected}
              >
                <option value="">Select a book</option>
                {props.availableBooks.map((book, index) => {
                  if (book !== props.selectedBook) {
                    const bookName = book.name;
                    const bookId = book._id;
                    const bookLang = bookService.getBookLanguage(book);

                    return (
                      <option
                        key={bookId}
                        value={bookId}
                      >{`${bookName} (${bookLang})`}</option>
                    );
                  } else {
                    return null;
                  }
                })}
              </Form.Select>
            </Form.Label>
            <Form.Label className="my-2 me-4 text-tertiary" as="h5">
              New Song Number
              <Form.Control
                className="mt-2 w-fit"
                type="tel"
                value={
                  props.newSongInfo.bookNum === -1
                    ? ""
                    : props.newSongInfo.bookNum
                }
                onChange={onSongNumberChange}
                required
              />
            </Form.Label>
            <Form.Label className="my-2 me-4 text-tertiary" as="h5">
              New Song Name
              <Form.Control
                className="mt-2"
                type="text"
                value={props.newSongInfo.name}
                onChange={onSongNameChange}
                required
              />
            </Form.Label>
            <Form.Label className="my-2 me-4 text-tertiary" as="h5">
              New Search Name
              <Form.Control
                className="mt-2"
                type="text"
                value={props.newSongInfo.searchName}
                onChange={onSongSearchNameChange}
                required
              />
            </Form.Label>
            <Form.Label className="my-2 me-4 text-tertiary w-fit " as="h5">
              Select Book Language
              <Form.Select
                className="mt-2"
                aria-label="Select the book the song that will be updated is in"
                value={
                  props.newSongInfo.lang
                    ? props.newSongInfo.lang
                    : props.selectedBook
                    ? props.selectedBook.lang
                    : ""
                }
                onChange={onSongLanguageChange}
              >
                <option value="">Select a language</option>
                <option key="kr" value="kr">
                  Kréyol
                </option>
                <option key="fr" value="fr">
                  Français
                </option>
              </Form.Select>
            </Form.Label>
          </div>
        )}
      </div>
    );
  } else {
    return <></>;
  }
};
