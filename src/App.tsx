import logo from "./logo.svg";
import "./App.css";
import { getDeckId } from "./getCards.ts";
import { useEffect, useState } from "react";

function App() {
  const [deckId, setDeckId] = useState("");
  const [southCards, setSouthCards] = useState([]);
  const [southOpeningBid, setSouthOpeningBid] = useState([]);
  const [northCards, setNorthCards] = useState([]);

  const enum sortedColors {
    "SPADES" = "SPADES",
    "HEARTS" = "HEARTS",
    "DIAMONDS" = "DIAMONDS",
    "CLUBS" = "CLUBS",
  }

  const higherCardsArray = ["JACK", "QUEEN", "KING", "ACE"];

  const higherCardsMap = {
    JACK: { hierarchyValue: 11, pointCardsValue: 1 },
    QUEEN: { hierarchyValue: 12, pointCardsValue: 2 },
    KING: { hierarchyValue: 13, pointCardsValue: 3 },
    ACE: { hierarchyValue: 14, pointCardsValue: 4 },
  };
  const reshuffle = () => {
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("error in getDeck");
      })
      .then((responseJson) => {
        setDeckId(responseJson.deck_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    reshuffle();
  }, []);

  const getPointCount = (cards, isSingle) => {
    return cards.reduce((acc, obj) => {
      const value =
        isSingle && obj.pointCardsValue
          ? obj.pointCardsValue - 1
          : obj.pointCardsValue;
      return acc + value;
    }, 0);
  };

  const isSingle = (cards) => {
    switch (cards.length) {
      case 1:
        return true;
      case 0:
      default:
        return false;
    }
  };

  const getOpeningBid = (cards) => {
    const { spades, hearts, diamonds, clubs } = coloredCards(cards);
    const colors = [
      { name: sortedColors.SPADES, length: spades.length, sort: "M" },
      { name: sortedColors.HEARTS, length: hearts.length, sort: "M" },
      { name: sortedColors.DIAMONDS, length: diamonds.length, sort: "m" },
      { name: sortedColors.CLUBS, length: clubs.length, sort: "m" },
    ];
    const lengthsArray = [
      spades.length,
      hearts.length,
      diamonds.length,
      clubs.length,
    ];
    const truePointCount =
      getPointCount(spades, isSingle(spades)) +
      getPointCount(hearts, isSingle(hearts)) +
      getPointCount(diamonds, isSingle(diamonds)) +
      getPointCount(clubs, isSingle(clubs));

    const colorString = () => {
      const sortedColorsWithLength = colors.sort((colorA, colorB) => {
        return colorB.length - colorA.length;
      });
      const stringsArray = sortedColorsWithLength.map((color) => {
        return `${color.length}${color.length >= 4 ? color.sort : ""}`;
      });

      return stringsArray.join("");
    };
    const explanation = `PC:${truePointCount}, ${colorString()}`;

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
      (diamonds.length === 5 && truePointCount >= 12 && truePointCount <= 14) ||
      (diamonds.length >= 6 && truePointCount >= 12 && truePointCount <= 17) ||
      (diamonds.length >= 6 && truePointCount === 11) ||
      (truePointCount >= 12 &&
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
      truePointCount >= 15 &&
      truePointCount <= 17 &&
      hearts.length < 5 &&
      spades.length < 5 &&
      !lengthsArray.includes(1) &&
      !lengthsArray.includes(0) &&
      clubs.length < 6 &&
      diamonds.length < 6
    ) {
      return `1BA, ${explanation}`;
      //a możesz tam zrobić alternatywę? żeby z jednej strony wpisać długości pomiędzy 2 a 4 i dodać ten wyjątek 5332? bo inaczej będzie otwierał też w 5m4M22
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

  const coloredCards = (cards) => {
    const spades = cards.filter((card) => card.suit === sortedColors.SPADES);
    const hearts = cards.filter((card) => card.suit === sortedColors.HEARTS);
    const clubs = cards.filter((card) => card.suit === sortedColors.CLUBS);
    const diamonds = cards.filter(
      (card) => card.suit === sortedColors.DIAMONDS
    );
    return { spades, hearts, clubs, diamonds };
  };

  useEffect(() => {
    if (!deckId) return;
    const get13CardsFromDeckId = async () => {
      const response = await fetch(
        `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=13`
      );
      const cards = await response.json();
      const cardsobj = cards.cards.map((card) => {
        return {
          ...card,
          hierarchyValue: higherCardsArray.includes(card.value)
            ? higherCardsMap[card.value].hierarchyValue
            : Number(card.value),
          pointCardsValue: higherCardsArray.includes(card.value)
            ? higherCardsMap[card.value].pointCardsValue
            : 0,
        };
      });
      return cardsobj.sort((cardA, cardB) => {
        return cardB.hierarchyValue - cardA.hierarchyValue;
      });
    };

    get13CardsFromDeckId().then((cards) => {
      const { spades, hearts, clubs, diamonds } = coloredCards(cards);
      const southCards = [...spades, ...hearts, ...clubs, ...diamonds];
      setSouthCards(southCards);
      setSouthOpeningBid(getOpeningBid(southCards));
    });

    get13CardsFromDeckId().then((cards) => {
      const { spades, hearts, clubs, diamonds } = coloredCards(cards);
      setNorthCards([...spades, ...hearts, ...clubs, ...diamonds]);
    });
  }, [deckId]);

  return (
    <div className="App">
      <div className="cards">
        {northCards.map((card, index) => {
          return index === 0 ? (
            <img
              src="https://www.deckofcardsapi.com/static/img/back.png"
              className="card firstCard"
            />
          ) : (
            <img
              src="https://www.deckofcardsapi.com/static/img/back.png"
              className="card"
            />
          );
        })}
      </div>
      <button onClick={reshuffle}>reshuffle</button>
      <h1>--------------</h1>
      <h2>{southOpeningBid}</h2>
      <div className="cards">
        {southCards.map((card, index) => {
          return index === 0 ? (
            <img src={card.image} className="card firstCard" />
          ) : (
            <img src={card.image} className="card" />
          );
        })}
      </div>
      <h3>v0.0.2</h3>
    </div>
  );
}

export default App;
