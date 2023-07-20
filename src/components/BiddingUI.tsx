import { Button } from "@mui/material";

import "./BiddingUI.css";
import { suitsEnum, Trump, BidExplanation } from "../helpers.ts";
interface BidUIProps {
  bidNumber: number;
  handleBidNumber: (n: number) => void;
  bidTrump: Trump;
  handleBidTrump: (t: Trump) => void;
  bidAnswer: BidExplanation;
  checkAnswer: () => void;
}
export const biddingNumbers = [
  { id: 1, text: "1" },
  { id: 2, text: "2" },
  { id: 3, text: "3" },
  { id: 4, text: "4" },
  { id: 5, text: "5" },
  { id: 6, text: "6" },
  { id: 7, text: "7" },
  { id: 0, text: "PAS" },
];
export const biddingTrumps = [
  { id: suitsEnum.CLUBS, text: "♣️" },
  { id: suitsEnum.DIAMONDS, text: "♦️" },
  { id: suitsEnum.HEARTS, text: "♥️" },
  { id: suitsEnum.SPADES, text: "♠️" },
  { id: "NT", text: "BA" },
];

export const BiddingUI = (props: BidUIProps) => {
  console.log(props.bidAnswer);
  console.log(
    props.bidNumber,
    props.bidTrump,
    props.bidNumber !== null,
    props.bidTrump !== undefined,
    props.bidNumber === 0
  );
  return (
    <div className="biddingUI">
      <div className="row row-numbers">
        {biddingNumbers.map((number) => {
          return (
            <Button
              className="biddingUI_button"
              variant={number.id === props.bidNumber ? "contained" : "outlined"}
              onClick={() => {
                props.handleBidNumber(number.id);
                number.id === 0 && props.handleBidTrump(null);
              }}
            >
              {number.text}
            </Button>
          );
        })}
      </div>
      <div className="row suits">
        {biddingTrumps.map((trump) => {
          return (
            <Button
              disabled={!props.bidNumber}
              className="biddingUI_button"
              variant={
                trump.id === props.bidTrump && props.bidNumber
                  ? "contained"
                  : "outlined"
              }
              onClick={() => {
                props.handleBidTrump(trump.id);
              }}
            >
              {trump.text}
            </Button>
          );
        })}
      </div>
      <Button
        disabled={
          (!props.bidNumber || !props.bidTrump) && props.bidNumber !== 0
        }
        className="biddingUI_button"
        variant="outlined"
        onClick={props.checkAnswer}
      >
        Potwierdź
      </Button>
    </div>
  );
};
