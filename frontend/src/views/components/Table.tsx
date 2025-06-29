import { useState } from "react";
import {Deck,DeckUtils} from "shared/src/Deck";
import { ExternalHooks } from "../../Client";

export default function Table() {
    const [table, setTable] = useState<Deck>(DeckUtils.None);

    ExternalHooks.OnSyncTable = (t) => setTable(t); 

    return (
        <div>
            <h2>Table</h2>
            <p>
                {DeckUtils.ToString(table as number)}
            </p>
        </div>
    );
    return
}