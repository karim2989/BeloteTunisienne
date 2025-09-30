import { useEffect, useState, type ReactNode } from "react";
import ScoreBoard from "./Scoreboard/ScoreBoard";
import "./gamescreen.css"
import ChatBox from "./ChatBox/ChatBox";
import { ExternalHooks, getNameboard, RequestPlay } from "../client";
import { DeckUtils, type Deck } from "../../../shared/src/Deck";
import BiddingArea from "./BiddingArea/BiddingArea";
import { Bid, BidType } from "shared/src/Bid";
import { CardUtils, type Card } from "shared/src/Card";
import CombinedBiddingStatusArea from "./CombinedBiddingStatusArea/CombinedBiddingStatusArea.tsx";


const unicodeChars = new Map<string, string>([
    ["1S", "🂡"], ["7S", "🂧"], ["8S", "🂨"], ["9S", "🂩"], ["XS", "🂪"], ["VS", "🂫"], ["QS", "🂭"], ["KS", "🂮"],
    ["1C", "🃑"], ["7C", "🃗"], ["8C", "🃘"], ["9C", "🃙"], ["XC", "🃚"], ["VC", "🃛"], ["QC", "🃝"], ["KC", "🃞"],
    ["1H", "🂱"], ["7H", "🂷"], ["8H", "🂸"], ["9H", "🂹"], ["XH", "🂺"], ["VH", "🂻"], ["QH", "🂽"], ["KH", "🂾"],
    ["1D", "🃁"], ["7D", "🃇"], ["8D", "🃈"], ["9D", "🃉"], ["XD", "🃊"], ["VD", "🃋"], ["QD", "🃍"], ["KD", "🃎"]
]);
const unicodeCardColors = new Map<string, string>([
    // Spades (black)
    ["1S", "black"], ["7S", "black"], ["8S", "black"], ["9S", "black"], ["XS", "black"], ["VS", "black"], ["QS", "black"], ["KS", "black"],
    // Clubs (black)
    ["1C", "black"], ["7C", "black"], ["8C", "black"], ["9C", "black"], ["XC", "black"], ["VC", "black"], ["QC", "black"], ["KC", "black"],
    // Hearts (red)
    ["1H", "red"], ["7H", "red"], ["8H", "red"], ["9H", "red"], ["XH", "red"], ["VH", "red"], ["QH", "red"], ["KH", "red"],
    // Diamonds (red)
    ["1D", "red"], ["7D", "red"], ["8D", "red"], ["9D", "red"], ["XD", "red"], ["VD", "red"], ["QD", "red"], ["KD", "red"]
]);

export default function GameScreen(): ReactNode {
    const [hand, setHand] = useState<Deck>(DeckUtils.None)
    const [table, setTable] = useState<Card[]>([])
    const [currentBid, setCurrentBid] = useState<Bid>(new Bid(0,0));
    const [wantedBid, setWantedBid] = useState<Bid>(new Bid(0,0));
    useEffect(() => {
        ExternalHooks.OnSyncHand.push((h) => {
            setHand(h);
        })
        ExternalHooks.OnSyncBid.push((b) => {
            setCurrentBid(b);
        })
        ExternalHooks.OnSyncTable.push((d) => {
            setTable(d);
        })
    }, [])
    return (
        <>
            <aside>
                <ScoreBoard />
                <ChatBox />
            </aside>
            <div className='flexfiller leftaside'>
                <CombinedBiddingStatusArea currentBid={currentBid} wantedBid={wantedBid} setWantedBid={setWantedBid}/>
                <div className=" square">variable area
                    {!table || table.length == 0 ? <BiddingArea /> :
                        table.filter(e => e > 0).map((e, i) =>
                            <span key={i} className={"card " + unicodeCardColors.get(CardUtils.ToString(e))}>
                                {unicodeChars.get(CardUtils.ToString(e))}
                            </span>
                        )
                    }
                </div>
                <div className="hand rectangle">
                    <span>your hand</span>
                    <br />
                    {DeckUtils.ToString(hand).split(' ').map((e, i) =>
                        <>
                            <span key={99 + i} onClick={() => RequestPlay(CardUtils.FromString(e))} className={"card handcard " + unicodeCardColors.get(e)}>{unicodeChars.get(e)}</span>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}