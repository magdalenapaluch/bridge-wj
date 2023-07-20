import { Button, FormGroup, FormControlLabel, Switch } from "@mui/material";

import "./BiddingUI.css";
import { suitsEnum, Trump, BidExplanation } from "../../helpers.ts";
import { useState } from "react";
interface BidUIProps {
  handleBidNumber: (n: number) => void;
  handleBidTrump: (t: Trump) => void;
}
const biddingNumbers = [
  { id: 1, text: "1" },
  { id: 2, text: "2" },
  { id: 3, text: "3" },
  { id: 4, text: "4" },
  { id: 5, text: "5" },
  { id: 6, text: "6" },
  { id: 7, text: "7" },
];

const biddingTrumps = [
  { id: suitsEnum.CLUBS, text: "♣️" },
  { id: suitsEnum.DIAMONDS, text: "♦️" },
  { id: suitsEnum.HEARTS, text: "♥️" },
  { id: suitsEnum.SPADES, text: "♠️" },
  { id: "NT", text: "BA" },
];

export const BiddingUI = (props: BidUIProps) => {
  const [localBidNumber, setLocalBidNumber] = useState<number | null>(null);
  const [localBidTrump, setLocalBidTrump] = useState<Trump>();
  
  return (
    <div className="biddingUI">
      <div className="row row-numbers">
        {biddingNumbers.map((number) => {
          return (
            <Button
              className="biddingUI_button"
              variant={number.id === localBidNumber ? "contained" : "outlined"}
              onClick={() => {
                setLocalBidNumber(number.id);
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
              disabled={!localBidNumber}
              className="biddingUI_button"
              variant={
                trump.id === localBidTrump && localBidNumber
                  ? "contained"
                  : "outlined"
              }
              onClick={() => {
                setLocalBidTrump(trump.id);
              }}
            >
              {trump.text}
            </Button>
          );
        })}
      </div>
      <div className="row">
        <Button
          disabled={(!localBidNumber || !localBidTrump) && localBidNumber !== 0}
          className="biddingUI_button"
          variant="outlined"
          onClick={() => {
            props.handleBidNumber(localBidNumber);
			props.handleBidTrump(localBidTrump);
			setLocalBidTrump(null);
			setLocalBidNumber(null);
          }}
        >
          Potwierdź
        </Button>
        <Button
          className="biddingUI_button"
          variant={"outlined"}
          onClick={() => {
            props.handleBidNumber(0);
            props.handleBidTrump(null);
          }}
        >
          PAS
        </Button>
      </div>
    </div>
  );
};
