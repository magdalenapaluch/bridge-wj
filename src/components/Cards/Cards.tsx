import { useMemo } from "react";
import { Card } from "../Card/Card.tsx";

export const Cards = (props) => {
	const {cards} = props

	
	const cardsList = useMemo(
		() =>
		  cards.map((card, index) => {
			return <Card card={card} index={index} key={index} />;
		  }),
		[cards]
	  );
  return (
    <div className="cards-wrapper">
      <div className="cards">{cardsList}</div>
    </div>
  );
};
