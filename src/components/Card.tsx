import { suitsEnum } from "../helpers";

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
      key={`card-index`}
      className={`card${index === 0 ? " firstCard" : ""}`}
    >
      <img src={card?.image} className="cardImage front " />
    </div>
  );
};
