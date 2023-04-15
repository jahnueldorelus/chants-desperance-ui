import { Song } from "@app-types/entities/songs";
import { authService } from "@services/auth";
import { songsService } from "@services/songs";
import { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";

export const Favorites = () => {
  const userInfo = authService.userInfo;
  const [favoriteSongs, setFavoriteSongs] = useState<Song[] | null>(null);
  const attemptedAPIRequest = useRef<boolean>(false);

  useEffect(() => {
    if (!attemptedAPIRequest.current) {
      attemptedAPIRequest.current = true;
      getFavoriteSongs();
    }
  }, []);

  const getFavoriteSongs = async () => {
    const songs = await songsService.getAllFavoriteSongs();
    setFavoriteSongs(songs);
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

  if (userInfo) {
    return (
      <Container className="py-5">
        <h1>
          Welcome home, {titleCase(userInfo.firstName)}&nbsp;
          {titleCase(userInfo.lastName)}
        </h1>

        <h4>Songs:</h4>
        {favoriteSongs &&
          favoriteSongs.map((song) => (
            <div className="ms-5 my-2 w-fit">
              <h5>Id: {song._id}</h5>
              <h5>Title: {song.name}</h5>
              <h5>Book #: {song.bookNum}</h5>
              <h5>Has Chorus: {song.hasChorus}</h5>
              <h5>Language: {song.lang === "fr" ? "French" : "Kreyol"}</h5>
              <h5># of Verses: {song.numOfVerses}</h5>
              <hr />
            </div>
          ))}
      </Container>
    );
  } else {
    return <></>;
  }
};
