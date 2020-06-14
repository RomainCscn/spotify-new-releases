import { ArtistsSort } from "./artists.ts";

export type View = "ALBUMS" | "ARTISTS";

export interface Settings {
  email: string;
  sort: ArtistsSort;
  view: View;
}
