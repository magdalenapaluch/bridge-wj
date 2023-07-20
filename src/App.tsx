import { Button, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { BiddingUI } from "./components/BiddingUI.tsx";
import { Card } from "./components/Card.tsx";
import {
  coloredCards,
  higherCardsArray,
  higherCardsMap,
  suitsEnum,
  Trump,
  BidExplanation,
  colorsLibrary,
} from "./helpers.ts";
import { getOpeningBid } from "./helpers/getOpeningBid.ts";

function App() {
  const [deckId, setDeckId] = useState("");
  const [southCards, setSouthCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [southOpeningBid, setSouthOpeningBid] = useState<BidExplanation | null>(
    null
  );
  const [showExplanation, setShowExplanataion] = useState(false);
  const [bidNumber, setBidNumber] = useState<number | null>(null);
  const [bidTrump, setBidTrump] = useState<Trump>();
  const [tested, setTested] = useState<boolean | null>(null);

  const getDeckID = () => {
    setIsLoading(true);
    setSouthOpeningBid(null);
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

  const reshuffle = () => {
    if (!deckId) return;
    setTested(null);
    setIsLoading(true);
    setSouthOpeningBid(null);
    setBidNumber(null);
    setBidTrump(null);
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("error in getDeck");
      })
      .then(() => {
        get13CardsFromDeckId().then((cards) => {
          const { spades, hearts, clubs, diamonds } = coloredCards(cards);
          const southCards = [...spades, ...hearts, ...clubs, ...diamonds];
          setSouthCards(southCards);
          setSouthOpeningBid(getOpeningBid(southCards));
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

  const toggleExplanation = () => {
    setShowExplanataion((e) => !e);
  };

  const southCardsList = useMemo(
    () =>
      southCards.map((card, index) => {
        return <Card card={card} index={index} key={index} />;
      }),
    [southCards]
  );

  const handleBidNumber = (num) => {
    setBidNumber(num);
  };
  const handleBidTrump = (trump) => {
    setBidTrump(trump);
  };
  const checkAnswer = () => {
    console.log(southOpeningBid, bidNumber, bidTrump);
    if (
      southOpeningBid.number === bidNumber &&
      southOpeningBid.trump == bidTrump
    ) {
      setTested(true);
    } else {
      setTested(false);
    }
  };
  return (
    <div className="App">
      <div className="wrapper">
        <div className="interface">
          <Button variant="outlined" onClick={reshuffle}>
            Przetasuj
          </Button>
          <FormGroup>
            <FormControlLabel
              label="Pokazuj odpowiedzi"
              labelPlacement="bottom"
              control={<Switch onChange={toggleExplanation} />}
            />
          </FormGroup>
        </div>
        <div className="cards-wrapper">
          <div className="cards">{southCardsList}</div>
        </div>
        <div className="bid">
          {!isLoading && southOpeningBid && showExplanation && (
            <>
              <h2>{`${southOpeningBid.bidString}`}</h2>
              <p>{`${southOpeningBid.explanationString}`}</p>
            </>
          )}
          {tested === null && !showExplanation && (
            <BiddingUI
              bidNumber={bidNumber}
              handleBidNumber={handleBidNumber}
              bidTrump={bidTrump}
              handleBidTrump={handleBidTrump}
              bidAnswer={southOpeningBid}
              checkAnswer={checkAnswer}
            />
          )}
          {tested !== null && (
            <>
              <div className="tested">
                <p>
                  Twoja odpowiedź:
                  <span className="big">
                    {bidNumber === 0
                      ? " PAS"
                      : `${bidNumber}${
                          bidTrump === "NT" ? "BA" : colorsLibrary.get(bidTrump)
                        }`}
                  </span>
                </p>
                {tested ? (
                  <p>To prawidłowa odpowiedź</p>
                ) : (
                  <p>
                    Źle, prawidłowa odpowiedź to:
                    <span className="big">{southOpeningBid.bidString}</span>
                  </p>
                )}
              </div>
              <Button variant="outlined" onClick={reshuffle}>
                Przetasuj
              </Button>
            </>
          )}
        </div>
      </div>
      <p style={{ textAlign: "right", fontSize: "12px" }}>v0.0.5</p>
    </div>
  );
}

export default App;
