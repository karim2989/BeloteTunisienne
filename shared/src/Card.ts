import { DeckUtils } from "./Deck";

export type Card = number;

export abstract class CardUtils {


    public static readonly SuiteMask = 0x01_01_01_01;

    public static readonly Seven = 0b0000_0001;
    public static readonly Eight = 0b0000_0010;
    public static readonly Nine = 0b0000_0100;
    public static readonly Valet = 0b0000_1000;
    public static readonly Queen = 0b0001_0000;
    public static readonly King = 0b0010_0000;
    public static readonly Ten = 0b0100_0000;
    public static readonly Eleven = 0b1000_0000;

    public static readonly SevenOfHearts = CardUtils.Seven * (DeckUtils.Heart & CardUtils.SuiteMask);
    public static readonly EightOfHearts = CardUtils.Eight * (DeckUtils.Heart & CardUtils.SuiteMask);
    public static readonly NineOfHearts = CardUtils.Nine * (DeckUtils.Heart & CardUtils.SuiteMask);
    public static readonly ValetOfHearts = CardUtils.Valet * (DeckUtils.Heart & CardUtils.SuiteMask);
    public static readonly QueenOfHearts = CardUtils.Queen * (DeckUtils.Heart & CardUtils.SuiteMask);
    public static readonly KingOfHearts = CardUtils.King * (DeckUtils.Heart & CardUtils.SuiteMask);
    public static readonly TenOfHearts = CardUtils.Ten * (DeckUtils.Heart & CardUtils.SuiteMask);
    public static readonly ElevenOfHearts = CardUtils.Eleven * (DeckUtils.Heart & CardUtils.SuiteMask);

    public static readonly SevenOfDiamonds = CardUtils.Seven * (DeckUtils.Diamond & CardUtils.SuiteMask);
    public static readonly EightOfDiamonds = CardUtils.Eight * (DeckUtils.Diamond & CardUtils.SuiteMask);
    public static readonly NineOfDiamonds = CardUtils.Nine * (DeckUtils.Diamond & CardUtils.SuiteMask);
    public static readonly ValetOfDiamonds = CardUtils.Valet * (DeckUtils.Diamond & CardUtils.SuiteMask);
    public static readonly QueenOfDiamonds = CardUtils.Queen * (DeckUtils.Diamond & CardUtils.SuiteMask);
    public static readonly KingOfDiamonds = CardUtils.King * (DeckUtils.Diamond & CardUtils.SuiteMask);
    public static readonly TenOfDiamonds = CardUtils.Ten * (DeckUtils.Diamond & CardUtils.SuiteMask);
    public static readonly ElevenOfDiamonds = CardUtils.Eleven * (DeckUtils.Diamond & CardUtils.SuiteMask);

    public static readonly SevenOfSpades = CardUtils.Seven * (DeckUtils.Spade & CardUtils.SuiteMask);
    public static readonly EightOfSpades = CardUtils.Eight * (DeckUtils.Spade & CardUtils.SuiteMask);
    public static readonly NineOfSpades = CardUtils.Nine * (DeckUtils.Spade & CardUtils.SuiteMask);
    public static readonly ValetOfSpades = CardUtils.Valet * (DeckUtils.Spade & CardUtils.SuiteMask);
    public static readonly QueenOfSpades = CardUtils.Queen * (DeckUtils.Spade & CardUtils.SuiteMask);
    public static readonly KingOfSpades = CardUtils.King * (DeckUtils.Spade & CardUtils.SuiteMask);
    public static readonly TenOfSpades = CardUtils.Ten * (DeckUtils.Spade & CardUtils.SuiteMask);
    public static readonly ElevenOfSpades = CardUtils.Eleven * (DeckUtils.Spade & CardUtils.SuiteMask);

    public static readonly SevenOfClubs = CardUtils.Seven * (DeckUtils.Club & CardUtils.SuiteMask);
    public static readonly EightOfClubs = CardUtils.Eight * (DeckUtils.Club & CardUtils.SuiteMask);
    public static readonly NineOfClubs = CardUtils.Nine * (DeckUtils.Club & CardUtils.SuiteMask);
    public static readonly ValetOfClubs = CardUtils.Valet * (DeckUtils.Club & CardUtils.SuiteMask);
    public static readonly QueenOfClubs = CardUtils.Queen * (DeckUtils.Club & CardUtils.SuiteMask);
    public static readonly KingOfClubs = CardUtils.King * (DeckUtils.Club & CardUtils.SuiteMask);
    public static readonly TenOfClubs = CardUtils.Ten * (DeckUtils.Club & CardUtils.SuiteMask);
    public static readonly ElevenOfClubs = CardUtils.Eleven * (DeckUtils.Club & CardUtils.SuiteMask);


    public static Suit(card: Card): number {
        if ((card & (card - 1)) != 0) throw 'the fnction [Suit(card: Card): number] does not accept decks';

        if (card & DeckUtils.Heart) return DeckUtils.Heart;
        else if (card & DeckUtils.Diamond) return DeckUtils.Diamond;
        else if (card & DeckUtils.Spade) return DeckUtils.Spade;
        else if (card & DeckUtils.Club) return DeckUtils.Club;

        throw new Error("invalid input " + card);
    }

    public static Rank(card: Card): number {
        if ((card & (card - 1)) != 0) throw 'the fnction [Rank(card: Card): number] does not accept decks';

        switch (CardUtils.Suit(card)) {
            case DeckUtils.Heart: return card;
            case DeckUtils.Diamond: return card >>> 8;
            case DeckUtils.Spade: return card >>> 16;
            case DeckUtils.Club: return card >>> 24;

            default: throw "invalid input " + card;
        }
    }

    public static PlainValue(card: Card) {
        if ((card & (card - 1)) != 0) throw 'the fnction [PlainValue(card: Card): number] does not accept decks';
        let r = CardUtils.Rank(card)

        switch (r) {
            case CardUtils.Seven: return 0;
            case CardUtils.Eight: return 0;
            case CardUtils.Nine: return 0;
            case CardUtils.Valet: return 2;
            case CardUtils.Queen: return 3;
            case CardUtils.King: return 4;
            case CardUtils.Ten: return 10;
            case CardUtils.Eleven: return 11;

            default: throw 'value lookup: invalid call with param ' + card;
        }
    }


    public static TrumpValue(card: Card) {
        if ((card & (card - 1)) != 0) throw 'the fnction [TrumpValue(card: Card): number] does not accept decks';
        let r = CardUtils.Rank(card)

        switch (r) {
            case CardUtils.Seven: return 0;
            case CardUtils.Eight: return 0;
            case CardUtils.Nine: return 14;
            case CardUtils.Valet: return 20;
            case CardUtils.Queen: return 3;
            case CardUtils.King: return 4;
            case CardUtils.Ten: return 10;
            case CardUtils.Eleven: return 11;

            default: throw 'value lookup: invalid call with param ' + card
        }
    }


    public static IsSuit(card: Card, suit: Card): boolean {
        if ((card & (card - 1)) != 0) throw 'the fnction [IsSuit(card: Card): number] does not accept decks';
        return (suit & card) !== 0;
    }


    /**
     * 
     * @param card1 
     * @param card2 
     * @param Trump 
     * @returns returns true if card1 is larger than card2
     */

    public static Compare(card1: Card, card2: Card, Trump: Card): boolean {
        if (CardUtils.IsSuit(card1, Trump) && !CardUtils.IsSuit(card2, Trump)) return true;
        else if (!CardUtils.IsSuit(card1, Trump) && CardUtils.IsSuit(card2, Trump)) return false;
        else if (CardUtils.IsSuit(card1, Trump)) {
            let [v1, v2] = [CardUtils.TrumpValue(card1), CardUtils.TrumpValue(card2)]
            if (v1 == v2) return card1 > card2
            else return v1 > v2
        }
        else {
            let [v1, v2] = [CardUtils.PlainValue(card1), CardUtils.PlainValue(card2)]
            if (v1 == v2) return card1 > card2
            else return v1 > v2
        }
    }

    public static FromString(card: string): number {
        if (card.length !== 2) throw 'invalid card string ' + card;
        let rank, suit;
        switch (card[0].toLocaleLowerCase()) {
            case '7': rank = CardUtils.Seven; break;
            case '8': rank = CardUtils.Eight; break;
            case '9': rank = CardUtils.Nine; break;
            case 'v': rank = CardUtils.Valet; break;
            case 'q': rank = CardUtils.Queen; break;
            case 'k': rank = CardUtils.King; break;
            case 'x': rank = CardUtils.Ten; break;
            case '1': rank = CardUtils.Eleven; break;
            default: throw 'FromString: invalid rank ' + card[0];
        }
        switch (card[1].toLocaleLowerCase()) {
            case 'h': suit = DeckUtils.Heart; break;
            case 'd': suit = DeckUtils.Diamond; break;
            case 's': suit = DeckUtils.Spade; break;
            case 'c': suit = DeckUtils.Club; break;
            default: throw 'FromString: invalid suit ' + card[1];
        }
        return rank * (suit & CardUtils.SuiteMask);
    }

    public static ToString(card: number): string {
        let rank = '';
        switch (CardUtils.Rank(card)) {
            case CardUtils.Seven: rank = '7'; break;
            case CardUtils.Eight: rank = '8'; break;
            case CardUtils.Nine: rank = '9'; break;
            case CardUtils.Valet: rank = 'V'; break;
            case CardUtils.Queen: rank = 'Q'; break;
            case CardUtils.King: rank = 'K'; break;
            case CardUtils.Ten: rank = 'X'; break;
            case CardUtils.Eleven: rank = '1'; break;
        }
        let suit = '';
        switch (CardUtils.Suit(card)) {
            case DeckUtils.Heart: suit = 'H'; break;
            case DeckUtils.Diamond: suit = 'D'; break;
            case DeckUtils.Spade: suit = 'S'; break;
            case DeckUtils.Club: suit = 'C'; break;
        }
        return rank + suit;
    }

    public static FromRankAndSuit(rank: number, suit: number) {
        return rank * (suit & CardUtils.SuiteMask);
    }
}