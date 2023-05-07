export type AddOrUpdateSongInfo = {
  catId: string;
  songId: string | null;
  numOfVerses: number;
  name: string;
  searchName: string;
  bookNum: number;
  hasChorus: boolean;
  lang: string;
  verses: AddOrUpdateSongVerse[];
};

export type AddOrUpdateSongVerse = {
  verseNum: number;
  isChorus: boolean;
  verse: string;
};

export type DeleteSongInfo = {
  songId: string | null;
};
