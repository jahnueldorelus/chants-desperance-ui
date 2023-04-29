import { Fragment } from "react";
import { DesktopViewSongsList } from "./components/desktop-view-songs-list";
import { MobileViewSongsList } from "./components/mobile-view-songs-list";
import { Song } from "@app-types/entities/songs";
import { Book } from "@app-types/entities/books";

type SongsListViewProps = {
  songs: Song[];
  books?: Book[];
  onSongClick: (song: Song) => () => void;
};

export const SongsListView = (props: SongsListViewProps) => {

  return (
    <Fragment>
      <DesktopViewSongsList
        songs={props.songs}
        books={props.books}
        onSongClick={props.onSongClick}
      />
      <MobileViewSongsList
        songs={props.songs}
        books={props.books}
        onSongClick={props.onSongClick}
      />
    </Fragment>
  );
};
