import { log, trace } from "console";

enum Suit {
    Unknown = -1, Clubs, Spade, Heart, Diamond, NoTrump, AllTrump
}
enum Rank {
    Unknown = -1, Seven, Eight, Nine, Valet, Dame, Roi, Ten, Eleven
}
const trumpRanksOrder: Map<Rank, number> = new Map<Rank, number>([
    [Rank.Unknown, -1],
    [Rank.Seven, 0],
    [Rank.Eight, 1],
    [Rank.Dame, 2],
    [Rank.Roi, 3],
    [Rank.Ten, 4],
    [Rank.Eleven, 5],
    [Rank.Nine, 6],
    [Rank.Valet, 7]
]);
const RankCharacter: Map<Rank, string> = new Map<Rank, string>([
    [Rank.Unknown, 'u'],
    [Rank.Seven, '7'],
    [Rank.Eight, '8'],
    [Rank.Nine, '9'],
    [Rank.Valet, 'v'],
    [Rank.Dame, 'd'],
    [Rank.Roi, 'r'],
    [Rank.Ten, 'x'],
    [Rank.Eleven, '1']
]);
const SuitCharacter: Map<Suit, string> = new Map<Suit, string>([
    [Suit.Unknown, 'u'],
    [Suit.Heart, '♥'],
    [Suit.Clubs, '♣'],
    [Suit.Diamond, '♦'],
    [Suit.Spade, '♠'],
    [Suit.AllTrump, '*'],
    [Suit.NoTrump, '∅']
]);

class Card {
    public Suit: Suit;
    public Rank: Rank;
    constructor(suit: Suit, rank: Rank) {
        this.Suit = suit;
        this.Rank = rank;
    }
    public GreaterThanWithContext(other: Card, trump: Suit): boolean {
        if (this.Suit == trump && other.Suit == trump)
            return this.GreaterThan(other, true);
        else if (this.Suit == trump)
            return true
        else if (other.Suit == trump)
            return false
        else
            return this.GreaterThan(other, false);
    }
    public GreaterThan(other: Card, isTrump: boolean = false): boolean {
        if (!isTrump)
            return this.Rank > other.Rank
        else
            return (trumpRanksOrder.get(this.Rank) as number) > (trumpRanksOrder.get(other.Rank) as number)
    }
    public Equals(c: Card): boolean {
        return c.Rank == this.Rank && c.Suit == this.Suit;
    }
    public get PlainPoint(): number {
        switch (this.Rank) {
            case Rank.Seven: return 0;
            case Rank.Eight: return 0;
            case Rank.Nine: return 0;
            case Rank.Valet: return 2;
            case Rank.Dame: return 3;
            case Rank.Roi: return 4;
            case Rank.Ten: return 10;
            case Rank.Eleven: return 11;

            default: throw trace('cannot calculate points');
        }
    }
    public get TrumpPoint(): number {
        switch (this.Rank) {
            case Rank.Seven: return 0;
            case Rank.Eight: return 0;
            case Rank.Dame: return 3;
            case Rank.Roi: return 4;
            case Rank.Ten: return 10;
            case Rank.Eleven: return 11;
            case Rank.Nine: return 14;
            case Rank.Valet: return 20;

            default: throw trace('cannot calculate points');
        }
    }
    public ToString(): string {
        return (RankCharacter.get(this.Rank) as string) + (SuitCharacter.get(this.Suit) as string)
    }
    public static FromString(input: string): Card {
        input = input[0] + input[1].replace("d", '♦').replace('s', '♠').replace("c", "♣").replace('h', '♥')
        let suitchars = Array.from(SuitCharacter)
        let rankchars = Array.from(RankCharacter)
        for (let i = 0; i < rankchars.length; i++)
            if (rankchars[i][1] == input[0])
                for (let j = 0; j < suitchars.length; j++)
                    if (suitchars[j][1] == input[1])
                        return new Card(suitchars[j][0], rankchars[i][0])
        throw trace("invalid input: " + input);
    }
}
export { Card, Rank, Suit, RankCharacter,SuitCharacter }