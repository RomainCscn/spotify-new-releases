import { formatMail, sendMail } from "./mail.ts";
import {
  getArtistLastAlbum as getSpotifyArtistLastAlbum,
  getArtistImages,
} from "./spotify.ts";
import {
  getAllArtists,
  getArtist,
  getArtistLastAlbum,
  insertArtist,
  insertLastAlbum,
  updateArtistLastAlbum,
} from "./queries.ts";
import {
  Artist,
  DbAlbum,
  Image,
  ArtistAndLastAlbum,
} from "./types.ts";

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
  const updatedArtist: ArtistAndLastAlbum[] = [];
  const artists = await getAllArtists();

  for (const { id, image = "", name, url } of artists) {
    const newRelease = await getNewRelease(id!);
    if (newRelease.isNewRelease) {
      updatedArtist.push(
        { id, image, name, url, lastAlbum: newRelease.lastRelease },
      );
      await insertLastAlbum(newRelease.lastRelease);
      await updateArtistLastAlbum(id!, newRelease.lastRelease.id);
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
