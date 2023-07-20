import {
  coloredCards,
  suitsEnum,
  getPointCount,
  isSingle,
  BidExplanation,
  colorsLibrary,
} from "../helpers.ts";
import { isEqual } from "lodash";

export const getOpeningBid = (cards): BidExplanation => {
  const { spades, hearts, diamonds, clubs } = coloredCards(cards);
  const lengthsArray: { suit: suitsEnum; length: number }[] = [
    { suit: suitsEnum.SPADES, length: spades.length },
    { suit: suitsEnum.HEARTS, length: hearts.length },
    { suit: suitsEnum.DIAMONDS, length: diamonds.length },
    { suit: suitsEnum.CLUBS, length: clubs.length },
  ];

  const sortedLengthsArray = lengthsArray
    .sort((a, b) => {
      return b.length - a.length;
    })
    .map((el) => el.length);
  console.log(sortedLengthsArray);
  const truePointCount =
    getPointCount(spades, isSingle(spades)) +
    getPointCount(hearts, isSingle(hearts)) +
    getPointCount(diamonds, isSingle(diamonds)) +
    getPointCount(clubs, isSingle(clubs));
  console.log(colorsLibrary);
  const colorString = () => {
    const suitsEnumWithLength = lengthsArray.sort((colorA, colorB) => {
      return colorB.length - colorA.length;
    });
    const stringsArray = suitsEnumWithLength.map((color) => {
      return `${color.length}${colorsLibrary.get(color.suit)}`;
    });
    return stringsArray.join("");
  };

  const explanation = `${truePointCount}PC, ${colorString()}`;

  if (
    (spades.length >= 5 && truePointCount >= 12 && truePointCount <= 17) ||
    (spades.length >= 6 && truePointCount === 11)
  ) {
    return {
      number: 1,
      trump: suitsEnum.SPADES,
      bidString: "1♠️",
      explanationString: explanation,
    };
  } else if (
    (hearts.length >= 5 && truePointCount >= 12 && truePointCount <= 17) ||
    (hearts.length >= 6 && truePointCount === 11)
  ) {
    return {
      number: 1,
      trump: suitsEnum.HEARTS,
      bidString: "1♥️",
      explanationString: explanation,
    };
  } else if (
    truePointCount >= 15 &&
    truePointCount <= 17 &&
    (isEqual([4, 3, 3, 3], sortedLengthsArray) ||
      isEqual([4, 4, 3, 2], sortedLengthsArray) ||
      (isEqual([5, 3, 3, 2], sortedLengthsArray) &&
        (diamonds.length === 5 || clubs.length === 5)))
  ) {
    return {
      number: 1,
      trump: "NT",
      bidString: "1BA",
      explanationString: explanation,
    };
  } else if (
    (diamonds.length >= 5 && truePointCount >= 12 && truePointCount <= 17) ||
    (diamonds.length >= 6 && truePointCount === 11) ||
    (truePointCount >= 11 &&
      truePointCount <= 17 &&
      diamonds.length === 4 &&
      lengthsArray.filter((item) => item.length === 4).length === 3) ||
    (diamonds.length === 4 &&
      clubs.length === 5 &&
      truePointCount >= 12 &&
      truePointCount <= 14)
  ) {
    return {
      number: 1,
      trump: suitsEnum.DIAMONDS,
      bidString: "1♦️",
      explanationString: explanation,
    };
  } else if (
    (truePointCount >= 12 &&
      truePointCount <= 14 &&
      ((clubs.length >= 5 && (hearts.length === 4 || spades.length === 4)) ||
        clubs.length >= 6)) ||
    (truePointCount === 11 && clubs.length >= 6)
  ) {
    return {
      number: 2,
      trump: suitsEnum.CLUBS,
      bidString: "2♣️",
      explanationString: explanation,
    };
  } else if (
    (truePointCount >= 12 && truePointCount <= 14) ||
    (truePointCount >= 15 && truePointCount <= 17 && clubs.length >= 5) ||
    truePointCount >= 18
  ) {
    return {
      number: 1,
      trump: suitsEnum.CLUBS,
      bidString: "1♣️",
      explanationString: explanation,
    };
  } else {
    return {
      number: 0,
      trump: null,
      bidString: "PAS",
      explanationString: explanation,
    };
  }
  //TODO: dodaj bloki,
  // 	w 11 pkt otwieramy, gdy:
  // - 6+ w kolorze
  // - 5 5 w dwóch kolorach
  // w 55, 4441 i 5440 otwarcia w 11
};
