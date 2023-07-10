export const get13CardsFromDeckId = async (deck_id) => {
  try {
    const response = await fetch(
      `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`
    );
    return response;
  } catch (error) {
    console.log("error in get13CardsFromDeckId", error);
  }
};
