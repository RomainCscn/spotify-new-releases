import { query } from "./db.ts";
import {
  Album,
  Artist,
  getArtistLastAlbum as getSpotifyArtistLastAlbum,
} from "./spotify.ts";

const getArtist = async (id: string) => {
  const result = await query("SELECT * FROM artist WHERE id = $1;", [id]);
  return result.rowsOfObjects()[0];
};

const findArtistInAlbum = (
  id: string,
  artists: Array<Artist>,
): Artist | undefined => artists.find((artist) => artist.id === id);

const insertArtist = async ({ id, name, url }: Artist, lastAlbum: Album) => {
  await query(
    "INSERT INTO artist (id, name, last_album, url) VALUES ($1, $2, $3, $4)",
    [id, name, lastAlbum.id, url],
  );
};

const insertLastAlbum = async (
  { name, id, releaseDate, url, artists }: Album,
) => {
  await query(
    "INSERT INTO album (name, id, release_date, url, artists) VALUES ($1, $2, $3, $4, $5)",
    [
      name,
      id,
      releaseDate,
      url,
      `{${artists.map((artist) => artist.id).toString()}}`,
    ],
  );
};

const updateArtistLastAlbum = async (artistId: string, albumId: string) => {
  await query(
    "UPDATE artist SET last_album = $1 WHERE id = $2;",
    [albumId, artistId],
  );
};

export const addNewArtist = async (id: string) => {
  const artistInDb = await getArtist(id);
  if (artistInDb) {
    throw Error(`Artist ${artistInDb.name} already exists`);
  }

  const lastSpotifyAlbum = await getSpotifyArtistLastAlbum(id);
  const artist = findArtistInAlbum(id, lastSpotifyAlbum.artists);
  await insertLastAlbum(lastSpotifyAlbum);
  if (artist) await insertArtist(artist, lastSpotifyAlbum);
  return { artist, album: lastSpotifyAlbum };
};

const getArtistLastAlbum = async (id: string) => {
  const result = await query(
    "SELECT album.id, album.release_date FROM album JOIN artist ON album.id = artist.last_album WHERE artist.id = $1;",
    [id],
  );
  return result.rowsOfObjects()[0];
};

const getNewRelease = async (id: string) => {
  const artistInDb = await getArtist(id);
  if (!artistInDb) {
    throw Error(`Artist with id ${id} not found`);
  }

  const lastSpotifyAlbum = await getSpotifyArtistLastAlbum(id);
  const lastDbAlbum = await getArtistLastAlbum(id);

  const isNewRelease = lastSpotifyAlbum.id !== lastDbAlbum.id &&
    new Date(lastSpotifyAlbum.releaseDate) > new Date(lastDbAlbum.release_date);

  return {
    isNewRelease: isNewRelease,
    lastRelease: lastSpotifyAlbum,
  };
};

export const checkAllNewRelease = async () => {
  const updatedArtist = [];
  const result = await query("SELECT id, name FROM artist;");
  for (const { id, name } of result.rowsOfObjects()) {
    const newRelease = await getNewRelease(id);
    if (newRelease.isNewRelease) {
      updatedArtist.push({ id, name });
      await insertLastAlbum(newRelease.lastRelease);
      await updateArtistLastAlbum(id, newRelease.lastRelease.id);
    }
  }

  return updatedArtist;
};
