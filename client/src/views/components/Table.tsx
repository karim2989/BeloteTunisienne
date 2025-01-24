import { useState } from "react";
import Deck from "shared/src/Deck";
import { ExternalHooks } from "../../Client";

export default function Table() {
    const [table, setTable] = useState<Deck>(Deck.None);

    ExternalHooks.OnSyncTable = (t) => setTable(t); 

    return (
        <div>
            <h2>Table</h2>
            <p>
                {Deck.ToString(table as number)}
            </p>
        </div>
    );
    return
}