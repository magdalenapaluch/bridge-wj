import {
  coloredCards,
  suitsEnum,
  getPointCount,
  isSingle,
  BidExplanation,
  colorsLibrary,
} from "../helpers.ts";
import { isEqual } from "lodash";

const isInRange = (x, min, max) => {
  if (min === null) return x <= max;
  if (max === null) return x >= min;
  return x <= max && x >= min;
};

export const getOpeningBid = (cards): BidExplanation => {
  const { spades, hearts, diamonds, clubs } = coloredCards(cards);

  const lengthsArray: { suit: suitsEnum; length: number; cards: any }[] = [
    { suit: suitsEnum.SPADES, length: spades.length, cards: spades },
    { suit: suitsEnum.HEARTS, length: hearts.length, cards: hearts },
    { suit: suitsEnum.DIAMONDS, length: diamonds.length, cards: diamonds },
    { suit: suitsEnum.CLUBS, length: clubs.length, cards: clubs },
  ];

  const sortedLengthsArray: number[] = lengthsArray
    .sort((a, b) => {
      return b.length - a.length;
    })
    .map((el) => el.length);

  const PC =
    getPointCount(spades, isSingle(spades)) +
    getPointCount(hearts, isSingle(hearts)) +
    getPointCount(diamonds, isSingle(diamonds)) +
    getPointCount(clubs, isSingle(clubs));

  const colorString = () => {
    const suitsEnumWithLength = lengthsArray.sort((colorA, colorB) => {
      return colorB.length - colorA.length;
    });
    const stringsArray = suitsEnumWithLength.map((color) => {
      return `${color.length}${colorsLibrary.get(color.suit)}`;
    });
    return stringsArray.join("");
  };

  const explanation = `${PC}PC, ${colorString()}`;
  const other = { explanationString: explanation, PC: PC };

  //6+, 4441 i 5440 i 55
  const shouldOpenIn11 = (suit: suitsEnum): boolean => {
    const suitLength = lengthsArray.find((el) => el.suit === suit).length;
    return (
      suitLength >= 6 || //6+ w kolorze
      (suitLength === 5 &&  // 55
        sortedLengthsArray.filter((number) => number === 5).length >= 2) ||
      (suitLength === 5 && // 5440
        isEqual([5, 4, 4, 0], sortedLengthsArray))
    );
  };

  const isBalancedHand = () => {
    return (
      isEqual([4, 3, 3, 3], sortedLengthsArray) ||
      isEqual([4, 4, 3, 2], sortedLengthsArray) ||
      (isEqual([5, 3, 3, 2], sortedLengthsArray) &&
        (diamonds.length === 5 || clubs.length === 5))
    );
  };

  const is4441 = () => {
    return isEqual([4, 4, 4, 1], sortedLengthsArray);
  };

  const shouldBlock = (): {
    boolean: boolean;
    answer: BidExplanation | null;
  } => {
    const longSuitLength = sortedLengthsArray.filter((el) =>
      [6, 7, 8, 9].includes(el)
    )[0];

    const bidValue = longSuitLength - 4; // for 6 in suit it would be 2, for 7->3 and so on
    if (isInRange(PC, 6, 10) && longSuitLength) {
      const suit = lengthsArray.find((el) => el.length === longSuitLength).suit;
      if (suit === suitsEnum.CLUBS && longSuitLength === 6)
        return { boolean: false, answer: null };
      return {
        boolean: true,
        answer: {
          number: bidValue,
          trump: suit,
          bidString: `${bidValue}${colorsLibrary.get(suit)}`,
          ...other,
        },
      };
    } else {
      return { boolean: false, answer: null };
    }
  };

  if (
    (spades.length >= 5 && isInRange(PC, 12, 17)) ||
    (isInRange(PC, 10, 11) && shouldOpenIn11(suitsEnum.SPADES))
  ) {
    return {
      number: 1,
      trump: suitsEnum.SPADES,
      bidString: "1♠️",
      ...other,
    };
  } else if (
    (hearts.length >= 5 && isInRange(PC, 12, 17)) ||
    (isInRange(PC, 10, 11) && shouldOpenIn11(suitsEnum.HEARTS))
  ) {
    return {
      number: 1,
      trump: suitsEnum.HEARTS,
      bidString: "1♥️",
      ...other,
    };
  } else if (isInRange(PC, 15, 17) && isBalancedHand()) {
    return {
      number: 1,
      trump: "NT",
      bidString: "1BA",
      ...other,
    };
  } else if (
    (diamonds.length >= 5 && isInRange(PC, 12, 17)) ||
    (PC === 11 && shouldOpenIn11(suitsEnum.DIAMONDS)) ||
    (isInRange(PC, 11, 17) && diamonds.length === 4 && is4441()) ||
    (diamonds.length === 4 && clubs.length === 5 && isInRange(PC, 12, 14))
  ) {
    return {
      number: 1,
      trump: suitsEnum.DIAMONDS,
      bidString: "1♦️",
      ...other,
    };
  } else if (
    (isInRange(PC, 12, 14) &&
      ((clubs.length >= 5 && (hearts.length === 4 || spades.length === 4)) ||
        clubs.length >= 6)) ||
    (PC === 11 && shouldOpenIn11(suitsEnum.CLUBS))
  ) {
    return {
      number: 2,
      trump: suitsEnum.CLUBS,
      bidString: "2♣️",
      ...other,
    };
  } else if (
    isInRange(PC, 12, 14) ||
    (isInRange(PC, 15, 17) && clubs.length >= 5) ||
    isInRange(PC, 18, null) ||
    (is4441() && diamonds.length === 1 && isInRange(PC, 11, 17))
  ) {
    return {
      number: 1,
      trump: suitsEnum.CLUBS,
      bidString: "1♣️",
      ...other,
    };
  }
  if (shouldBlock().boolean) {
    return shouldBlock().answer;
  } else {
    return {
      number: 0,
      trump: null,
      bidString: "PAS",
      ...other,
    };
  }
};
