import { useState } from "react";
import { Deck, DeckUtils } from "shared/src/Deck";
import { ExternalHooks } from "../../Client";
import { Card, CardUtils } from "shared/src/Card";
import { Bid } from "shared/src/bid";

export default function BidStatus() {
    const [bid, setBid] = useState<{ bid: Bid }>();

    ExternalHooks.OnSyncCurrentBid = (bid) => setBid({ bid });

    return (
        <div>
            <h2>Hand</h2>
            <p>
                {
                    bid ? `Player ${bid.bid.Player} bid ${bid.bid.Value} ${bid.bid.Trump} ${bid.bid.Type}` : 'No bid yet'
                }
            </p>
        </div>
    );
    return
}