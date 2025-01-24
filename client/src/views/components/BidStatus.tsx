import { useState } from "react";
import Deck from "shared/src/Deck";
import { ExternalHooks } from "../../Client";
import Card from "shared/src/Card";
import { BidType } from "shared/src/Round";

export default function BidStatus() {
    const [bid, setBid] = useState<{ playerId: number, bidType: BidType, bidTrump: Card, bidValue: number }>();

    ExternalHooks.OnSyncCurrentBid = (id, type, trump, value) => setBid({ playerId: id, bidType: type, bidTrump: trump, bidValue: value });

    return (
        <div>
            <h2>Hand</h2>
            <p>
                {
                    bid ? `Player ${bid.playerId} bid ${bid.bidValue} ${bid.bidTrump} ${bid.bidType}` : 'No bid yet'
                }
            </p>
        </div>
    );
    return
}