import { useState } from "react";
import {DeckUtils,Deck} from "shared/src/Deck";
import { ExternalHooks } from "../../Client";

export default function Hand() {
    const [hand, setHand] = useState<Deck>(DeckUtils.None);

    ExternalHooks.OnSyncHand = (h) => setHand(h); 

    return (
        <div>
            <h2>Hand</h2>
            <p>
                {DeckUtils.ToString(hand as number)}
            </p>
        </div>
    );
    return
}