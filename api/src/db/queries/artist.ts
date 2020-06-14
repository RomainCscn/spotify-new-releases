import { query } from "../index.ts";
import {
  ArtistsSort,
  Artist,
  ArtistAndLastAlbum,
  Album,
  DbAlbum,
  sortType,
} from "../../types/artists.ts";
import { formatArtistAndAlbum } from "../../utils/index.ts";

export const getArtist = async (
  id: string,
): Promise<Artist | null> => {
  const result = await query("SELECT * FROM artist WHERE id = $1;", [id]);
  const artist = result.rowsOfObjects().length > 0
    ? result.rowsOfObjects()[0]
    : null;

  if (!artist) return null;

  return {
    id: artist.id,
    name: artist.name,
    image: artist.name,
    url: artist.url,
  };
};

export const getArtistLastAlbum = async (
  id: string,
): Promise<Pick<Album, "id" | "releaseDate">> => {
  const result = await query(
    "SELECT album.id, album.release_date FROM album JOIN artist ON album.id = artist.last_album WHERE artist.id = $1;",
    [id],
  );

  return {
    id: result.rowsOfObjects()[0].id,
    releaseDate: result.rowsOfObjects()[0].release_date,
  };
};

export const getAllArtists = async (): Promise<Artist[]> => {
  const result = await query(
    "SELECT * FROM artist;",
  );

  return <Artist[]> result.rowsOfObjects();
};

export const getAllArtistsAndLastRelease = async (
  sort: ArtistsSort = "-releaseDate",
): Promise<
  Partial<ArtistAndLastAlbum>[]
> => {
  const result = await query(
    `SELECT artist.id, artist.name, artist.url, artist.image, album.id, album.name, album.url, album.release_date, album.image 
     FROM artist JOIN album ON artist.last_album = album.id 
     ORDER BY ${sortType[sort]};`,
  );

  return result.rows.map((row: string[]) => formatArtistAndAlbum(row));
};

export const deleteArtist = async (id: string) => {
  await query(
    "DELETE FROM artist WHERE artist.id = $1;",
    [id],
  );
};

export const insertArtist = async (
  { id, name, url, image }: Artist,
  lastAlbum: Album,
) => {
  await query(
    "INSERT INTO artist (id, name, last_album, url, image) VALUES ($1, $2, $3, $4, $5)",
    [id, name, lastAlbum.id, url, image!],
  );
};

export const insertLastAlbum = async ({
  name,
  id,
  releaseDate,
  url,
  artist: artistId,
  image,
}: DbAlbum) => {
  await query(
    "INSERT INTO album (name, id, release_date, url, artist, image) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      name,
      id,
      releaseDate,
      url,
      artistId,
      image,
    ],
  );
};

export const updateArtistLastAlbum = async (
  artistId: string,
  albumId: string,
) => {
  await query("UPDATE artist SET last_album = $1 WHERE id = $2;", [
    albumId,
    artistId,
  ]);
};
