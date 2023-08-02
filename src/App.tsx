import { useEffect, useState } from "react";
import "./App.css";
import { Bids } from "./components/Bids/Bids.tsx";
import { Cards } from "./components/Cards/Cards.tsx";
import { Interface } from "./components/Interface/Interface.tsx";
import { Settings } from "./components/Settings/Settings.tsx";
import {
  BidExplanation,
  coloredCards,
  higherCardsArray,
  higherCardsMap,
  Trump,
} from "./helpers.ts";
import { getOpeningBid } from "./helpers/getOpeningBid.ts";

// TODO: dodać eslinta
// TODO: dodać jesta i unit testy
// TODO: zrobić porządek z danymi, trumpami suitami, explanation
// TODO: calle do api wynieść gdzieś
// TODO: dodaj loading na kartach (opacity na .6 jak loading)

function App() {
  // Settings
  const [isDrawerOpen, setIsDrowerOpen] = useState(false);
  const [showExplanation, setShowExplanataion] = useState(false);
  const [fastCheck, setFastCheck] = useState(false);
  const [onlyOpening, setOnlyOpening] = useState(false);

  // Cards:
  const [deckId, setDeckId] = useState("");
  const [southCards, setSouthCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bids
  const [southOpeningBid, setSouthOpeningBid] = useState<BidExplanation | null>(
    null
  );

  const getDeckID = () => {
    setIsLoading(true);
    setSouthOpeningBid(null);
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((response) => response.json())
      .then((responseJson) => setDeckId(responseJson.deck_id))
      .catch((error) => {
        console.log(error);
      });
  };

  const resetAll = () => {
    setIsLoading(true);
    setSouthCards(Array.from({ length: 13 }));
    setSouthOpeningBid(null);
  };

  const reshuffle = () => {
    if (!deckId) return;
    resetAll();
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(() => {
        get13CardsFromDeckId().then((cards) => {
          const { spades, hearts, clubs, diamonds } = coloredCards(cards);
          const southCards = [...spades, ...hearts, ...clubs, ...diamonds];
          const bid = getOpeningBid(southCards);
          if (bid.PC < 6) {
            reshuffle();
            return;
          }
          setSouthCards(southCards);
          setSouthOpeningBid(bid);
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getDeckID();
  }, []);

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

  useEffect(() => {
    if (!deckId) return;
    get13CardsFromDeckId().then((cards) => {
      const { spades, hearts, clubs, diamonds } = coloredCards(cards);
      const southCards = [...spades, ...hearts, ...clubs, ...diamonds];
      setSouthCards(southCards);
      setIsLoading(false);
      setSouthOpeningBid(getOpeningBid(southCards));
    });
  }, [deckId]);

  return (
    <div className="App">
      <Settings
        showExplanation={showExplanation}
        fastCheck={fastCheck}
        onlyOpening={onlyOpening}
        isDrawerOpen={isDrawerOpen}
        handleClose={() => setIsDrowerOpen(false)}
        toggleExplanation={() => setShowExplanataion((e) => !e)}
        toggleFastCheck={() => setFastCheck((e) => !e)}
        toggleOnlyOpening={() => setOnlyOpening((e) => !e)}
      />
      <div className="wrapper">
		  <h1 className="title">Co otworzysz z tą kartą?</h1>
        <Interface
          reshuffle={reshuffle}
          openSettings={() => setIsDrowerOpen(true)}
        />
        <Cards cards={southCards} />
        <Bids
          isLoading={isLoading}
          southOpeningBid={southOpeningBid}
          showExplanation={showExplanation}
          fastCheck={fastCheck}
          reshuffle={reshuffle}
        />
      </div>
      <p style={{ textAlign: "right", fontSize: "12px" }}>v0.0.11</p>
    </div>
  );
}

export default App;
