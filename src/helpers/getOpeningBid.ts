import { coloredCards, suitsEnum, getPointCount, isSingle } from "../helpers.ts";
import { isEqual } from "lodash";

  export  const getOpeningBid = (cards) => {
    const { spades, hearts, diamonds, clubs } = coloredCards(cards);
    const colors = [
      {
        name: suitsEnum.SPADES,
        length: spades.length,
        suit: "♠️",
        color: "black",
      },
      {
        name: suitsEnum.HEARTS,
        length: hearts.length,
        suit: "♥️",
        color: "red",
      },
      {
        name: suitsEnum.DIAMONDS,
        length: diamonds.length,
        suit: "♦️",
        color: "red",
      },
      {
        name: suitsEnum.CLUBS,
        length: clubs.length,
        suit: "♣️",
        color: "black",
      },
    ];
    const lengthsArray: number[] = [
      spades.length,
      hearts.length,
      diamonds.length,
      clubs.length,
    ];

    const sortedLengthsArray = lengthsArray.sort((a, b) => {
      return b - a;
	});
	
    const truePointCount =
      getPointCount(spades, isSingle(spades)) +
      getPointCount(hearts, isSingle(hearts)) +
      getPointCount(diamonds, isSingle(diamonds)) +
      getPointCount(clubs, isSingle(clubs));

    const colorString = () => {
      const suitsEnumWithLength = colors.sort((colorA, colorB) => {
        return colorB.length - colorA.length;
      });
      const stringsArray = suitsEnumWithLength.map((color) => {
        return `${color.length}${color.suit}`;
      });
      return stringsArray.join("");
	};
	
    const explanation = `${truePointCount}PC, ${colorString()}`;

    if (
      (spades.length >= 5 && truePointCount >= 12 && truePointCount <= 17) ||
      (spades.length >= 6 && truePointCount === 11)
    ) {
      return `1♠️, ${explanation}`;
    } else if (
      (hearts.length >= 5 && truePointCount >= 12 && truePointCount <= 17) ||
      (hearts.length >= 6 && truePointCount === 11)
    ) {
      return `1♥️, ${explanation}`;
    } else if (
      truePointCount >= 15 &&
      truePointCount <= 17 &&
      (isEqual([4, 3, 3, 3], sortedLengthsArray) ||
        isEqual([4, 4, 3, 2], sortedLengthsArray) ||
        (isEqual([5, 3, 3, 2], sortedLengthsArray) &&
          (diamonds.length === 5 || clubs.length === 5)))
    ) {
      return `1BA, ${explanation}`;
    } else if (
      (diamonds.length >= 5 && truePointCount >= 12 && truePointCount <= 17) ||
      (diamonds.length >= 6 && truePointCount === 11) ||
      (truePointCount >= 11 &&
        truePointCount <= 17 &&
        diamonds.length === 4 &&
        lengthsArray.filter((item) => item === 4).length === 3) ||
      (diamonds.length === 4 &&
        clubs.length === 5 &&
        truePointCount >= 12 &&
        truePointCount <= 14)
    ) {
      return `1♦️, ${explanation}`;
    } else if (
      (truePointCount >= 12 &&
        truePointCount <= 14 &&
        ((clubs.length >= 5 && (hearts.length === 4 || spades.length === 4)) ||
          clubs.length >= 6)) ||
      (truePointCount === 11 && clubs.length >= 6)
    ) {
      return `2♣️, ${explanation}`;
    } else if (
      (truePointCount >= 12 && truePointCount <= 14) ||
      (truePointCount >= 15 && truePointCount <= 17 && clubs.length >= 5) ||
      truePointCount >= 18
    ) {
      return `1♣️, ${explanation}`;
    } else {
      return `PAS, ${explanation}`;
    }
    //TODO: dodaj bloki,
    // 	w 11 pkt otwieramy, gdy:
    // - 6+ w kolorze
    // - 5 5 w dwóch kolorach
    // w 55, 4441 i 5440 otwarcia w 11
  };