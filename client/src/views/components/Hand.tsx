import { useState } from "react";
import Deck from "shared/src/Deck";
import { ExternalHooks } from "../../Client";

export default function Hand() {
    const [hand, setHand] = useState<Deck>(Deck.None);

    ExternalHooks.OnSyncHand = (h) => setHand(h); 

    return (
        <div>
            <h2>Hand</h2>
            <p>
                {Deck.ToString(hand as number)}
            </p>
        </div>
    );
    return
}