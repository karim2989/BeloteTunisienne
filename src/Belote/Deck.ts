import { log } from "console";
import { Card, Suit, Rank } from "./Card";

class Deck extends Array<Card> {
    public static OrganizedDeck(): Deck {
        let output: Deck = new Deck();
        (['s', 'c', 'd', 'h']).forEach(e1 => {
            (['7', '8', '9', 'v', 'd', 'r', 'x', '1']).forEach(e2 => {
                output.push(Card.FromString(e2 + e1))
            })
        });
        return output;
    }
    public Shuffle() {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }
    public Pop8(): Deck {
        if (this.length < 8)
            throw "cannot pop8"
        let output = new Deck()
        for (let i = 0; i < 8; i++)
            output.push(this.pop() as Card);
        return output;
    }
    public OfLargerRank(rank: Rank, trump: boolean = false): Deck {
        let output = new Deck()
        for (let i = 0; i < this.length; i++)
            if (this[i].GreaterThan(new Card(Suit.Unknown, rank), trump)) output.push(this[i])
        return output
    }
    public OfSuit(suit: Suit): Deck {
        let output = new Deck()
        for (let i = 0; i < this.length; i++)
            if (this[i].Suit == suit) output.push(this[i])
        return output
    }
    public IncludesDeck(s: Deck): boolean {
        for (let i = 0; i < s.length; i++)
            if (!this.IncludesCard(s[i])) return false
        return true
    }
    public IncludesCard(s: Card): boolean {
        for (let i = 0; i < this.length; i++)
            if (this[i].Equals(s)) return true
        return false
    }
    public static FromString(input: string): Deck {
        let output = new Deck();
        input.split(' ').forEach(e => output.push(Card.FromString(e)))
        return output;
    }
    public ToString(): string {
        let output = ""

        for (let i = 0; i < this.length; i++) {
            const element = this[i];
            output += element.ToString() + ' '
        }
        return output
    }
}

export { Deck }