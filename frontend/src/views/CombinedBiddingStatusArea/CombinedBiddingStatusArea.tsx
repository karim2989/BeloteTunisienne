import type { ReactNode } from "react";
import { Bid } from "shared/src/bid";
import BidDial from "../BidDial/BidDial";
import { CardUtils, type Card } from "shared/src/Card";
import { getNameboard } from "../../client";
import { DeckUtils } from "shared/src/Deck";
import "./CombinedBiddingStatusArea.css";
interface CombinedBiddingStatusAreaProps {
    bid?: Bid;
    setbid: (bid: Bid) => void;
}
export const SUIT_UNICODE: Record<Card | string, string> = {
    [CardUtils.Heart]: "♥",
    [CardUtils.Diamond]: "♦",
    [CardUtils.Club]: "♣",
    [CardUtils.Spade]: "♠",
    [DeckUtils.All]: "★",
    [DeckUtils.None]: "∅",
};
export default function CombinedBiddingStatusArea(prop: CombinedBiddingStatusAreaProps): ReactNode {

    return <>
        <div className="bidInfo square">
            <span>bid info</span><br />
            
            <BidDial
                currentSuit={prop.bid?.Trump as Card}
                currentValue={prop.bid?.Value as number}
                // @ts-ignore
                currentTeam={((prop.bid?.Player as number) % 2) + 1} />


                <div className="suitRow">
                    {([CardUtils.Heart, CardUtils.Diamond, CardUtils.Club, CardUtils.Spade, DeckUtils.None, DeckUtils.All] as Card[]).map((suit) => {
                        const selected = prop.bid?.Trump === suit;
                        return (
                            <span
                                key={suit}
                                onClick={() => {
                                    if (!prop.bid) return;
                                    const currentBid = prop.bid as Bid;
                                    prop.setbid({ ...currentBid, Trump: suit } as Bid);
                                }}
                                className={`suitOption${selected ? " selected" : ""}`}
                                aria-label={SUIT_UNICODE[suit]}
                                tabIndex={0}
                                onKeyDown={e => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        if (!prop.bid) return;
                                        const currentBid = prop.bid as Bid;
                                        prop.setbid({ ...currentBid, Trump: suit } as Bid);
                                    }
                                }}
                                role="button"
                            >
                                {SUIT_UNICODE[suit]}
                            </span>
                        );
                    })}
                </div>

            // backup bid stats:
            {prop.bid ? (
                <>
                    <span>bid player: {getNameboard()[prop.bid.Player]}</span> ---
                    <span> bid type: {prop.bid.Type}</span>
                    {prop.bid.Contree && <span> CONTREEEE</span>}
                    {prop.bid.Surcontree && <span> SURCONTREEEE</span>}
                    {prop.bid.Surmanchee && <span> SURMANCHEEEE</span>} ---
                    <span> bid trump: {SUIT_UNICODE[prop.bid.Trump]}</span> ---
                    <span> bid value: {prop.bid.Value}</span>
                </>
            ) : (
                <span>No bid yet</span>
            )}
        </div>
    </>
}
