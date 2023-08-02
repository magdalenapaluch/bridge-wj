import { suitsEnum } from "../../helpers.ts";
import "./Card.css";

interface Card {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: suitsEnum;
}

interface CardProps {
  card: Card;
  index: number;
}

export const Card = (props: CardProps) => {
  const { card, index } = props;
  return (
    <div
      key={`card-index${card?.code}`}
      className={`card${index === 0 ? " firstCard" : ""}`}
    >
      <img
        style={{ transition: `0.4s opacity ${index}s` }} //TODO: add animation
        src={"https://www.deckofcardsapi.com/static/img/back.png"}
        className="cardImage front "
      />
      <img
        style={{
          opacity: card ? 1 : 0,
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          transition: `0.4s opacity ${index}s`,
        }}
        src={card && card?.images.png}
        className="cardImage front "
      />
    </div>
  );
};
