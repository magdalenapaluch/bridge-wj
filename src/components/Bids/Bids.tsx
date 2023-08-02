import { Button } from "@mui/material";
import { BidExplanation, colorsLibrary, Trump } from "../../helpers.ts";
import { BiddingUI } from "../BiddingUI/BiddingUI.tsx";
import { useEffect, useState } from "react";

interface BidsProps {
  isLoading: boolean;
  southOpeningBid: BidExplanation | null;
  showExplanation: boolean;
  fastCheck: boolean;
  tested: boolean | null;
  handleBidNumber: (num: number | null) => void;
  handleBidTrump: (t: Trump | null) => void;
  bidNumber: number | null;
  bidTrump: Trump | null;
  reshuffle: () => void;
}

export const Bids = (props: BidsProps) => {
  const {
    isLoading,
    southOpeningBid,
    showExplanation,
    // tested,
    // handleBidNumber,
    // handleBidTrump,
    // bidNumber,
    // bidTrump,
    reshuffle,
    fastCheck,
  } = props;

  const [bidNumber, setBidNumber] = useState<number | null>(null);
  const [bidTrump, setBidTrump] = useState<Trump>();
  const [tested, setTested] = useState<boolean | null>(null);

  const reset = () => {
    setBidNumber(null);
    setTested(null);
    setBidTrump(null);
  };

  useEffect(() => {
    if (!southOpeningBid) return;
    if (
      southOpeningBid.number === bidNumber &&
      southOpeningBid.trump == bidTrump
    ) {
      if (fastCheck) {
        reshuffle();
        reset();
        return;
      }
      setTested(true);
    } else {
      setTested(false);
    }
  }, [bidNumber, bidTrump]);

  return (
    <div className="bid">
      {!isLoading && southOpeningBid && showExplanation && tested === null && (
        <>
          <h2>{`${southOpeningBid.bidString}`}</h2>
          <p>{`${southOpeningBid.explanationString}`}</p>
        </>
      )}
      {tested === null && !showExplanation && (
        <BiddingUI
          handleBidNumber={(n) => setBidNumber(n)}
          handleBidTrump={(t) => setBidTrump(t)}
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
          <Button
            variant="outlined"
            onClick={() => {
              reshuffle();
              reset();
            }}
          >
            Przetasuj
          </Button>
        </>
      )}
    </div>
  );
};
