export const enum suitsEnum {
  "SPADES" = "SPADES",
  "HEARTS" = "HEARTS",
  "DIAMONDS" = "DIAMONDS",
  "CLUBS" = "CLUBS",
}

export const higherCardsArray = ["JACK", "QUEEN", "KING", "ACE"];

export const higherCardsMap = {
  JACK: { hierarchyValue: 11, pointCardsValue: 1 },
  QUEEN: { hierarchyValue: 12, pointCardsValue: 2 },
  KING: { hierarchyValue: 13, pointCardsValue: 3 },
  ACE: { hierarchyValue: 14, pointCardsValue: 4 },
};

export const coloredCards = (cards) => {
  const spades = cards.filter((card) => card.suit === suitsEnum.SPADES);
  const hearts = cards.filter((card) => card.suit === suitsEnum.HEARTS);
  const clubs = cards.filter((card) => card.suit === suitsEnum.CLUBS);
  const diamonds = cards.filter((card) => card.suit === suitsEnum.DIAMONDS);
  return { spades, hearts, clubs, diamonds };
};

export const getPointCount = (cards, isSingle) => {
  return cards.reduce((acc, obj) => {
    const value =
      isSingle && obj.pointCardsValue
        ? obj.pointCardsValue - 1
        : obj.pointCardsValue;
    return acc + value;
  }, 0);
};

export const isSingle = (cards) => {
  switch (cards.length) {
    case 1:
      return true;
    case 0:
    default:
      return false;
  }
};

