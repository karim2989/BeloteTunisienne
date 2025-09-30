import { useState, type ReactNode } from "react";
import { CardUtils, type Card } from "shared/src/Card";
import { DeckUtils } from "shared/src/Deck";
import { SUIT_UNICODE } from "./CombinedBiddingStatusArea";
import "./SuitSelector.css";

interface SuitSelectorProps {
    isKaputOrAbove : boolean;
    onSelect: (suit: Card) => void;
}

export default function SuitSelector(props: SuitSelectorProps): ReactNode {
    const canSelectNoneOrAll = props.isKaputOrAbove;
    const [selectedSuit,setSelectedSuit] = useState(CardUtils.Heart);
    return (
        <div className="suitRow">
            {([CardUtils.Heart, CardUtils.Diamond, CardUtils.Club, CardUtils.Spade, DeckUtils.None, DeckUtils.All] as Card[]).map((suit) => {
                const isSelected = selectedSuit === suit;
                const isNoneOrAll = suit === DeckUtils.None || suit === DeckUtils.All;
                const isDisabled = isNoneOrAll && !canSelectNoneOrAll;
                return (
                    <span
                        key={suit}
                        onClick={() => {
                            if (isDisabled) return;
                            setSelectedSuit(suit);
                            props.onSelect(suit);
                        }}
                        className={`suitOption${isSelected ? " selected" : ""}${isDisabled ? " disabled" : ""}`}
                        aria-label={SUIT_UNICODE[suit]}
                        aria-disabled={isDisabled}
                        tabIndex={isDisabled ? -1 : 0}
                        onKeyDown={e => {
                            if (isDisabled) return;
                            if (e.key === "Enter" || e.key === " ") {
                                props.onSelect(suit);
                            }
                        }}
                        role="button"
                    >
                        {SUIT_UNICODE[suit]}
                    </span>
                );
            })}
        </div>
    );
}


