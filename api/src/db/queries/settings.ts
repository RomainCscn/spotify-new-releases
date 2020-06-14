import { query } from "../index.ts";
import { Settings, View } from "../../types/settings.ts";
import { ArtistsSort } from "../../types/artists.ts";

export const getSettings = async (): Promise<Settings> => {
  const result = await query("SELECT * FROM setting;");

  return result.rowsOfObjects()[0] as Settings;
};

export const insertSettings = async (
  email: string,
  sort: ArtistsSort,
  view: View,
) => {
  const actualSettings = await getSettings();
  const values = {
    ...actualSettings,
    ...(email && { email }),
    ...(sort && { sort }),
    ...(view && { view }),
  };

  await query(
    "UPDATE setting SET email = $1, sort = $2, view = $3;",
    [values.email, values.sort, values.view],
  );
};
