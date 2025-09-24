type User = {
  id: number;
  username: string;
  email: string;
};

type Video = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
};

type Genre = {
  id: number;
  genre: string;
};

type GenreVideoProps = {
  genre: string;
};
