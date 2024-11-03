import { trace } from "console";
import { Card } from "./Card";
import { Play } from "./Play";
import { PlayerId } from "./Player";
import { Deck } from "./Deck";

class Trick extends Array<Play> {
    public WinningPlay: Play | null = null;

    public get TrickWinner(): PlayerId {
        if (this.WinningPlay == null) throw trace()
        return this.WinningPlay.Issuer;
    }
    public get IsEmpty(): boolean {
        return this.length == 0;
    }
    public get WinnigCard(): Card | null {
        if (this.WinningPlay == null) throw trace()
        return this.WinningPlay.Card;
    }
    public get LeadCard(): Card {
        if (this.at(0) == undefined) throw trace()
        return (this.at(0) as Play).Card
    }
    public AsDeck() : Deck {
        let output : Deck = new Deck();
        this.forEach(e => {
            output.push(e.Card)
        })
        return output
    }
}
export { Trick }