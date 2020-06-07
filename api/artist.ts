import { query } from "./db.ts";
import { formatMail, sendMail } from "./mail.ts";
import {
  getArtistLastAlbum as getSpotifyArtistLastAlbum,
  getArtistImages,
} from "./spotify.ts";
import { Artist, ArtistAndLastAlbum, Album, DbAlbum, Image } from "./types.ts";

const formatArtistAndAlbum = (row: string[]): ArtistAndLastAlbum => {
  return {
    id: row[0],
    name: row[1],
    url: row[2],
    image: row[3],
    lastAlbum: {
      id: row[4],
      name: row[5],
      url: row[6],
      image: row[7],
    },
  };
};

const getArtist = async (
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

const getArtistLastAlbum = async (
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

const insertArtist = async (
  { id, name, url, image }: Artist,
  lastAlbum: Album,
) => {
  await query(
    "INSERT INTO artist (id, name, last_album, url, image) VALUES ($1, $2, $3, $4, $5)",
    [id, name, lastAlbum.id, url, image!],
  );
};

const insertLastAlbum = async ({
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

const updateArtistLastAlbum = async (artistId: string, albumId: string) => {
  await query("UPDATE artist SET last_album = $1 WHERE id = $2;", [
    albumId,
    artistId,
  ]);
};

const getNewRelease = async (
  id: string,
): Promise<{ isNewRelease: boolean; lastRelease: DbAlbum }> => {
  const artistInDb = await getArtist(id);
  if (!artistInDb) {
    throw Error(`Artist with id ${id} not found`);
  }

  const lastSpotifyAlbum = await getSpotifyArtistLastAlbum(id);
  const lastDbAlbum = await getArtistLastAlbum(id);

  const isNewRelease = lastSpotifyAlbum.id !== lastDbAlbum.id &&
    new Date(lastSpotifyAlbum.releaseDate) >
      new Date(lastDbAlbum.releaseDate);

  return {
    isNewRelease: isNewRelease,
    lastRelease: { ...lastSpotifyAlbum, artist: lastSpotifyAlbum.artist.id },
  };
};

export const getAllArtists = async (): Promise<Partial<Artist>[]> => {
  const result = await query(
    "SELECT * FROM artist;",
  );
  return result.rowsOfObjects();
};

export const getAllArtistsAndLastRelease = async (): Promise<
  Partial<ArtistAndLastAlbum>[]
> => {
  const result = await query(
    "SELECT artist.id, artist.name, artist.url, artist.image, album.id, album.name, album.release_date, album.image FROM artist JOIN album ON artist.last_album = album.id;",
  );

  return result.rows.map((row: any) => formatArtistAndAlbum(row));
};

export const addNewArtist = async (id: string) => {
  const artistInDb: Artist | null = await getArtist(id);
  if (artistInDb) {
    throw Error(`Artist ${artistInDb.name} already exists`);
  }

  const lastSpotifyAlbum = await getSpotifyArtistLastAlbum(id);
  const imagesArtist = await getArtistImages(lastSpotifyAlbum.artist.id);
  const sortedImages = imagesArtist.sort((a: Image, b: Image) =>
    b.height - a.height
  );

  await insertArtist(
    { ...lastSpotifyAlbum.artist, image: sortedImages[0].url },
    lastSpotifyAlbum,
  );

  await insertLastAlbum(
    { ...lastSpotifyAlbum, artist: id },
  );
};

export const checkAllNewRelease = async () => {
  const updatedArtist = [];
  const result = await query("SELECT id, image, name, url FROM artist;");

  for (const { id, image, name, url } of result.rowsOfObjects()) {
    const newRelease = await getNewRelease(id);
    if (newRelease.isNewRelease) {
      updatedArtist.push(
        { artist: { image, name, url }, lastAlbum: newRelease.lastRelease },
      );
      await insertLastAlbum(newRelease.lastRelease);
      await updateArtistLastAlbum(id, newRelease.lastRelease.id);
    }
  }

  if (updatedArtist.length > 0) {
    sendMail(
      "New releases from your favorite artists!",
      formatMail(updatedArtist),
    );
  }

  return updatedArtist;
};

export const deleteArtist = async (id: string) => {
  await query(
    "DELETE FROM artist WHERE artist.id = $1;",
    [id],
  );
};
