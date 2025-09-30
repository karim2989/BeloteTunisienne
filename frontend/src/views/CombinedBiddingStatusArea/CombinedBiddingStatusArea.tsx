import type { ReactNode } from "react";
import { Bid, BidType } from "shared/src/bid";
import BidDial from "../BidDial/BidDial";
import { CardUtils, type Card } from "shared/src/Card";
// import { getNameboard } from "../../client";
import { DeckUtils } from "shared/src/Deck";
import "./CombinedBiddingStatusArea.css";
import SuitSelector from "./SuitSelector";
interface CombinedBiddingStatusAreaProps {
    currentBid?: Bid;
    wantedBid?: Bid;
    setWantedBid: (bid: Bid) => void;
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
                currentSuit={prop.currentBid?.Trump as Card}
                currentValue={prop.currentBid?.Value as number}
                // @ts-ignore
                currentTeam={((prop.currentBid?.Player as number) % 2) + 1}
                OnSetValue={(value) => {
                    if (!prop.wantedBid) return;
                    const currentBid = prop.wantedBid as Bid;
                    prop.setWantedBid({ ...currentBid, Value: value } as Bid);
                }}
            />


            <SuitSelector
                isKaputOrAbove={!!prop.wantedBid && prop.wantedBid.Value >= 190}
                onSelect={(suit) => {
                    if (!prop.wantedBid) return;
                    const currentBid = prop.wantedBid as Bid;
                    prop.setWantedBid({ ...currentBid, Trump: suit } as Bid);
                }}
            />


            <div className="bidActions">
                <button className="bidBtn bidBtn-pass"
                    onClick={() => {
                        if (!prop.wantedBid) return;
                        const currentBid = prop.wantedBid as Bid;
                        prop.setWantedBid({ ...currentBid, Type: BidType.pass, Value: NaN, Trump: NaN } as Bid);
                    }}
                >
                    pass
                </button>
                <button className="bidBtn bidBtn-annonce"
                    onClick={() => {
                        if (!prop.wantedBid) return;
                        const currentBid = prop.wantedBid as Bid;
                        const v = currentBid.Value;
                        const nextType = v >= 200 ? BidType.kaputgeneral : v >= 190 ? BidType.kaput : BidType.annonce;
                        prop.setWantedBid({ ...currentBid, Type: nextType } as Bid);
                    }}
                >
                    annonce
                </button>
                <button className="bidBtn bidBtn-severe"
                    onClick={() => {
                        if (!prop.wantedBid) return;
                        const currentBid = prop.wantedBid as Bid;
                        const isSevere = prop.currentBid?.IsSevere ?? false;
                        const nextType = isSevere ? BidType.surcontre : BidType.contre;
                        prop.setWantedBid({ ...currentBid, Type: nextType, Value: NaN } as Bid);
                    }}
                >
                    contre/surcontre
                </button>
            </div>


            {/*prop.bid ? (
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
            )*/}
        </div>
    </>
}
