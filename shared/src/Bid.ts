import { Card, CardUtils } from "./Card";
import { DeckUtils } from "./Deck";

export enum BidType { pass = 0, annonce = 1, contre = 2, surcontre = 3, kaput = 4, kaputgeneral = 5 }

export class Bid {
    public Player: number;
    public Type: BidType;
    public Trump: number;
    public Value: BidType;
    private contree: boolean = false;
    private surcontree: boolean = false;

    public get Contree() { return this.contree; }
    public set Contree(value: boolean) { this.contree = value; }
    public get Surcontree() { return this.surcontree; }
    public set Surcontree(value: boolean) { this.surcontree = value; }
    public get IsSevere(): boolean { return this.Type == BidType.contre || this.Type == BidType.surcontre; }

    constructor(
        bidPlayer: number,
        bidType: BidType = BidType.pass,
        bidTrump: Card = NaN,
        bidValue: BidType = NaN
    ) {
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
                if (isNaN(bidTrump) || bidTrump % DeckUtils.Heart != 0)
                    throw 'Invalid';
                break;
            case BidType.contre:
            case BidType.surcontre:
                if (!isNaN(bidValue) || isNaN(bidTrump))
                    throw 'Invalid';
                break;
            case BidType.kaput:
            case BidType.kaputgeneral:
                if (!isNaN(bidValue))
                    throw 'Invalid';
                if (isNaN(bidTrump) || bidTrump % DeckUtils.Heart != 0)
                    throw 'Invalid';
                break;
        }
    }
}
