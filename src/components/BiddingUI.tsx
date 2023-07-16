import { Button } from "@mui/material";

import "./BiddingUI.css";

export const BiddingUI = () => {
  const reshuffle = () => {};
  return (
    <div className="biddingUI">
      <div className="row">
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          1
        </Button>
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          2
        </Button>
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          3
        </Button>
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          4
        </Button>
      </div>
      <div className="row">
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          5
        </Button>
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          6
        </Button>
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          7
        </Button>
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          PAS
        </Button>
      </div>
      <div className="row suits">
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          ♣️
        </Button>
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          ♦️
        </Button>
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          ♥️
        </Button>
        <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
          ♠️
        </Button>
      </div>
      <Button className="biddingUI_button"variant="outlined" onClick={reshuffle}>
        Potwierdź
      </Button>
    </div>
  );
};
