import type { ReactNode } from "react";
import { Bid, BidType } from "shared/src/bid";
import BidDial from "../BidDial/BidDial";
import { CardUtils, type Card } from "shared/src/Card";
// import { getNameboard } from "../../client";
import { DeckUtils } from "shared/src/Deck";
import "./CombinedBiddingStatusArea.css";
import SuitSelector from "./SuitSelector";
import { getInRoomIndex, RequestBid } from "../../client";
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
    const finalizeBid = (severity: 'passe' | 'annonce' | 'contre') => {
        
        let bid = prop.wantedBid;
        switch (severity) {
            case "passe":
                bid = new Bid(getInRoomIndex(), BidType.pass);
                break;
            case "annonce":
                if(!prop.wantedBid) return;
                if (prop.wantedBid.Value < 190)
                    bid = new Bid(getInRoomIndex(), BidType.annonce, prop.wantedBid.Trump, prop.wantedBid?.Value);
                else if (prop.wantedBid.Value == 190)
                    bid = new Bid(getInRoomIndex(), BidType.kaput, prop.wantedBid.Trump);
                else
                bid = new Bid(getInRoomIndex(), BidType.kaputgeneral, prop.wantedBid.Trump ? prop.wantedBid.Trump:CardUtils.Heart);
                break;

            default:
                throw "contreeeee oisnt implemented yety"
                break;
        }
        console.log(bid);
        
        RequestBid(bid);
    };
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
                        finalizeBid("passe")
                    }}
                >
                    pass
                </button>
                <button className="bidBtn bidBtn-annonce"
                    onClick={() => {
                        finalizeBid("annonce")
                    }}
                >
                    annonce
                </button>
                <button className="bidBtn bidBtn-severe"
                    onClick={() => {
                        finalizeBid("contre")
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
