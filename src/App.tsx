import {
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  IconButton,
  Drawer,
} from "@mui/material";
import { useEffect, useMemo, useState, useCallback } from "react";
import "./App.css";
import { BiddingUI } from "./components/BiddingUI/BiddingUI.tsx";
import { Card } from "./components/Card/Card.tsx";
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
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { Settings } from "./components/Settings/Settings.tsx";

// TODO: dodać eslinta
// TODO: dodać jesta i unit testy
// TODO: zrobić porządek z danymi, trumpami suitami
// TODO: calle do api wynieść gdzieś
// TODO: wydzielić komponenty

function App() {
  const [deckId, setDeckId] = useState("");
  const [southCards, setSouthCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [southOpeningBid, setSouthOpeningBid] = useState<BidExplanation | null>(
    null
  );
  const [showExplanation, setShowExplanataion] = useState(false);
  const [fastCheck, setFastCheck] = useState(false);
  const [bidNumber, setBidNumber] = useState<number | null>(null);
  const [bidTrump, setBidTrump] = useState<Trump>();
  const [tested, setTested] = useState<boolean | null>(null);
  const [isDrawerOpen, setIsDrowerOpen] = useState(false);

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
    console.log("reshuffle");
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

  const toggleExplanation = () => {
    setShowExplanataion((e) => !e);
  };
  const toggleFastCheck = () => {
    setFastCheck((e) => !e);
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
  useEffect(() => {
    if (!southOpeningBid) return;
    if (
      southOpeningBid.number === bidNumber &&
      southOpeningBid.trump == bidTrump
    ) {
      if (fastCheck) {
        reshuffle();
        return;
      }
      setTested(true);
    } else {
      setTested(false);
    }
  }, [bidNumber, bidTrump]);

  return (
    <div className="App">
      <Settings
        showExplanation={showExplanation}
        fastCheck={fastCheck}
        isDrawerOpen={isDrawerOpen}
        handleClose={() => setIsDrowerOpen(false)}
        toggleExplanation={toggleExplanation}
        toggleFastCheck={toggleFastCheck}
      />
      <div className="wrapper">
        <div className="interface">
          <Button variant="outlined" onClick={reshuffle}>
            Przetasuj
          </Button>
          <IconButton
            style={{ position: "absolute", right: 0, top: 0 }}
            onClick={() => {
              setIsDrowerOpen(true);
            }}
            aria-label="settings"
            color="primary"
          >
            <SettingsIcon />
          </IconButton>
        </div>
        <div className="cards-wrapper">
          <div className="cards">{southCardsList}</div>
        </div>
        <div className="bid">
          {!isLoading && southOpeningBid && showExplanation && tested === null && (
            <>
              <h2>{`${southOpeningBid.bidString}`}</h2>
              <p>{`${southOpeningBid.explanationString}`}</p>
            </>
          )}
          {tested === null && !showExplanation && (
            <BiddingUI
              handleBidNumber={handleBidNumber}
              handleBidTrump={handleBidTrump}
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
                    <span className="big">{` ${southOpeningBid?.bidString}`}</span>
                  </p>
                )}
                <p>{`${southOpeningBid?.explanationString}`}</p>
              </div>
              <Button variant="outlined" onClick={reshuffle}>
                Przetasuj
              </Button>
            </>
          )}
        </div>
      </div>
      <p style={{ textAlign: "right", fontSize: "12px" }}>v0.0.9</p>
    </div>
  );
}

export default App;
