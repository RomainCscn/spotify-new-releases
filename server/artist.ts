import { query } from "./db.ts";
import { formatMail, sendMail } from "./mail.ts";
import {
  getArtistLastAlbum as getSpotifyArtistLastAlbum,
  getArtistImages,
} from "./spotify.ts";
import { Artist, ArtistAndLastAlbum, Album, Image } from "./types.ts";

const formatArtistAndAlbum = (row: string[]): ArtistAndLastAlbum => {
  return {
    artist: {
      name: row[0],
      url: row[1],
      image: row[2],
    },
    lastAlbum: {
      name: row[3],
      url: row[4],
      image: row[5],
    },
  };
};

const getArtistName = async (id: string): Promise<Pick<Artist, "name">> => {
  const result = await query("SELECT name FROM artist WHERE id = $1;", [id]);

  return { name: result.rowsOfObjects()[0].name };
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

const findArtistInAlbum = (
  id: string,
  artists: Array<Artist>,
): Artist | undefined => artists.find((artist) => artist.id === id);

const insertArtist = async (
  { id, name, url, image }: Artist,
  lastAlbum: Album,
) => {
  await query(
    "INSERT INTO artist (id, name, last_album, url, image) VALUES ($1, $2, $3, $4, $5)",
    [id, name, lastAlbum.id, url, image],
  );
};

const insertLastAlbum = async ({
  name,
  id,
  releaseDate,
  url,
  artists,
  image,
}: Album) => {
  await query(
    "INSERT INTO album (name, id, release_date, url, artists, image) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      name,
      id,
      releaseDate,
      url,
      `{${artists.map((artist) => artist.id).toString()}}`,
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

const getNewRelease = async (id: string) => {
  const artistInDb = await getArtistName(id);
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
    lastRelease: lastSpotifyAlbum,
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
    "SELECT artist.name, artist.url, artist.image, album.name, album.release_date, album.image FROM artist JOIN album ON artist.last_album = album.id;",
  );

  return result.rows.map((row: any) => formatArtistAndAlbum(row));
};

export const addNewArtist = async (id: string) => {
  const artistInDb: Pick<Artist, "name"> = await getArtistName(id);
  if (artistInDb) {
    throw Error(`Artist ${artistInDb.name} already exists`);
  }

  const lastSpotifyAlbum = await getSpotifyArtistLastAlbum(id);
  const artist = findArtistInAlbum(id, lastSpotifyAlbum.artists);

  if (!artist) throw Error("Artist not found in album artists");

  await insertLastAlbum(lastSpotifyAlbum);

  const imagesArtist = await getArtistImages(artist.id);
  const sortedImages = imagesArtist.sort((a: Image, b: Image) =>
    b.height - a.height
  );

  await insertArtist(
    { ...artist, image: sortedImages[0].url },
    lastSpotifyAlbum,
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
