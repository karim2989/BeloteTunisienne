import { CardUtils } from "./Card";
import { DeckUtils } from "./Deck";
export var BidType;
(function (BidType) {
    BidType[BidType["pass"] = 0] = "pass";
    BidType[BidType["annonce"] = 1] = "annonce";
    BidType[BidType["contre"] = 2] = "contre";
    BidType[BidType["surcontre"] = 3] = "surcontre";
    BidType[BidType["kaput"] = 4] = "kaput";
    BidType[BidType["kaputgeneral"] = 5] = "kaputgeneral";
})(BidType || (BidType = {}));
export class Bid {
    Player;
    Type;
    Trump;
    Value;
    contree = false;
    surcontree = false;
    get Contree() { return this.contree; }
    set Contree(value) { this.contree = value; }
    get Surcontree() { return this.surcontree; }
    set Surcontree(value) { this.surcontree = value; }
    get IsSevere() { return this.Type == BidType.contre || this.Type == BidType.surcontre; }
    constructor(bidPlayer, bidType = BidType.pass, bidTrump = NaN, bidValue = NaN) {
        this.Type = bidType;
        this.Trump = bidTrump;
        this.Value = bidValue;
        this.Player = bidPlayer;
        if (bidPlayer < 0 || bidPlayer > 3)
            throw 'Invalid';
        if (bidType < BidType.pass || bidType > BidType.kaputgeneral)
            throw 'Invalid';
        switch (bidType) {
            case BidType.pass:
                if (!isNaN(bidValue) || !isNaN(bidTrump))
                    throw 'Invalid';
                break;
            case BidType.annonce:
                if (isNaN(bidValue) || bidValue < 90 || bidValue > 180 || bidValue % 10 > 0)
                    throw 'Invalid';
                if (isNaN(bidTrump) || bidTrump % CardUtils.Heart != 0)
                    throw 'Invalid';
                break;
            case BidType.contre:
            case BidType.surcontre:
                DeckUtils;
                if (!isNaN(bidValue) || isNaN(bidTrump))
                    throw 'Invalid';
                break;
            case BidType.kaput:
            case BidType.kaputgeneral:
                if (!isNaN(bidValue))
                    throw 'Invalid';
                if (isNaN(bidTrump) || bidTrump % CardUtils.Heart != 0)
                    throw 'Invalid';
                break;
        }
    }
}
