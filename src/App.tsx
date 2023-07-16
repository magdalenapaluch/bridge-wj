import {
  Button,
  Switch,
  FormGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import "./App.css";
import { higherCardsArray, higherCardsMap, coloredCards } from "./helpers.ts";
import { getOpeningBid } from "./helpers/getOpeningBid.ts";
import { BiddingUI } from "./components/BiddingUI.tsx";

function App() {
  const [deckId, setDeckId] = useState("");
  const [southCards, setSouthCards] = useState([]);
  const [southOpeningBid, setSouthOpeningBid] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [northCards, setNorthCards] = useState([]);
  const [regenerateRandomNumbers, setRegenerateRandomNumbers] = useState(false);
  const randomNumbers = useMemo(() => {
    return Array.from({ length: 39 }).map((element) => {
      return Math.random();
    });
  }, [regenerateRandomNumbers]);

  const getDeckID = () => {
    setIsLoading(true);
    setSouthCards(Array.from({ length: 13 }));
    setSouthOpeningBid("");
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
    setSouthCards(Array.from({ length: 13 }));
    setIsLoading(true);
    setSouthOpeningBid("");
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

        get13CardsFromDeckId().then((cards) => {
          const { spades, hearts, clubs, diamonds } = coloredCards(cards);
          setNorthCards([...spades, ...hearts, ...clubs, ...diamonds]);
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);

        setRegenerateRandomNumbers((prevState) => {
          console.log("runs");
          return !prevState;
        });
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
    console.log(regenerateRandomNumbers);
  }, [regenerateRandomNumbers]);

  useEffect(() => {
    if (!deckId) return;

    get13CardsFromDeckId().then((cards) => {
      const { spades, hearts, clubs, diamonds } = coloredCards(cards);
      const southCards = [...spades, ...hearts, ...clubs, ...diamonds];
      setSouthCards(southCards);
      setIsLoading(false);
      setSouthOpeningBid(getOpeningBid(southCards));
    });

    // get13CardsFromDeckId().then((cards) => {
    //   const { spades, hearts, clubs, diamonds } = coloredCards(cards);
    //   setNorthCards([...spades, ...hearts, ...clubs, ...diamonds]);
    // });
  }, [deckId]);

  const toggleExplanation = () => {};

  const southCardsList = useMemo(
    () =>
      southCards.map((card, index) => {
        return (
          <div
            key={`card-index`}
            style={{
              position: "relative",
              transform: `rotate(${randomNumbers[index] * 4 - 2}deg)`,
              left: `${randomNumbers[index * 2] * 10 - 5}px`,
              top: `${randomNumbers[index * 3] * 10 - 5}px`,
              transition: `.2s ease-in ${index / 20}s`,
            }}
            className={`card${index === 0 ? " firstCard" : ""}`}
          >
            <img
              src={"https://www.deckofcardsapi.com/static/img/back.png"}
              className="cardImage back "
            />
            <img src={card?.image} className="cardImage front " />
            <div
              className="cardImageBack__wrapper"
              //TODO: fix animation
              style={{
                opacity: isLoading || !card ? 1 : 0,
                transition: `.2s`,
                transitionDelay: `${index / 20}s`,
              }}
            >
              <img
                src={"https://www.deckofcardsapi.com/static/img/back.png"}
                className="cardImage back "
              />
            </div>
          </div>
        );
      }),
    [southCards]
  );

  return (
    <div className="App">
      <div className="wrapper">
        {/* <div className="cards">
          {northCards.map((card, index) => {
            return (
              <img
                src="https://www.deckofcardsapi.com/static/img/back.png"
                className={`card ${index === 0 && "firstCard"}`}
              />
            );
          })}
        </div> */}
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
        {/* <h1>--------------</h1> */}
        <div className="bid">
          {!isLoading && southOpeningBid && <h2>{southOpeningBid}</h2>}
          {/* <BiddingUI /> */}
        </div>
        <div className="cards">{southCardsList}</div>
        <h3>v0.0.3</h3>
      </div>
    </div>
  );
}

export default App;
