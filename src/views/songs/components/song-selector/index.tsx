import { Book } from "@app-types/entities/books";
import { uiSearchParams } from "@components/header/uiSearchParams";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import { useSearchParams } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";
import { songsService } from "@services/songs";
import { Song } from "@app-types/entities/songs";

type SongSelectorProps = {
  book: Book | null;
  setSelectedBook: (book: Book | null) => void;
};

export const SongSelector = (props: SongSelectorProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [songs, setSongs] = useState<Song[]>([]);

  /**
   * Retrieves the list of songs of the selected book.
   */
  useEffect(() => {
    const getSongs = async () => {
      if (props.book) {
        let songsList = await songsService.getSongsByBook(props.book._id);

        if (songsList) {
          // Sorts songs by number
          songsList = songsList.sort(
            (songOne, songTwo) => songOne.bookNum - songTwo.bookNum
          );
        }

        setSongs(songsList || []);
      } else {
        setSongs([]);
      }
    };

    getSongs();
  }, [props.book]);

  /**
   * Removes the selected book to allow the user to choose another one.
   * @param event The mouse click event
   */
  const onGoBackClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    searchParams.delete(uiSearchParams.book);
    setSearchParams(searchParams);
    props.setSelectedBook(null);
  };

  /**
   * Retrieves the language of the book
   */
  const getBookLang = () => {
    if (props.book) {
      if (props.book.lang === "fr") {
        return "French";
      } else if (props.book.lang === "kr") {
        return "Kreyol";
      } else {
        return "Kreyol and French";
      }
    } else {
      return "";
    }
  };

  const listOfSongsJSX = () => {
    if (songs.length > 0) {
      return (
        <Col className="mt-3" md={8}>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th># of Verses</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => {
                return (
                  <tr>
                    <td>{song.bookNum}</td>
                    <td>{song.name}</td>
                    <td>{song.numOfVerses}</td>
                    <td>{song.numOfVerses}</td>
                    <td>
                      <Button>Open</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      );
    } else {
      return (
        <div className="mt-3">
          <h4>No songs found</h4>
        </div>
      );
    }
  };

  if (props.book && songs) {
    return (
      <div>
        <Button type="button" onClick={onGoBackClick}>
          Go Back
        </Button>

        <div className="mt-4 d-flex align-items-center">
          <h2 className="text-tertiary">{props.book.name}</h2>
          <h4>
            <Badge className="ms-3" bg="tertiary">
              {getBookLang()}
            </Badge>
          </h4>
        </div>

        {listOfSongsJSX()}
      </div>
    );
  } else {
    return <></>;
  }
};
