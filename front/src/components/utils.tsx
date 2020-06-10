export const deleteArtist = async (
  event: any,
  setShouldRefresh: (shouldRefresh: boolean) => void,
  id: string
) => {
  event.preventDefault();

  try {
    await fetch('http://0.0.0.0:8000/artist', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    setShouldRefresh(true);
  } catch (e) {
    console.error('Cannot delete artist', e);
  }
};
