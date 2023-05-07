export type Song = {
  _id: string;
  name: string;
  searchName: string;
  catId: string;
  numOfVerses: number;
  bookNum: number;
  hasChorus: boolean;
  lang: "kr" | "fr";
};