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


    public static readonly Heart = 0x00_00_00_ff;
    public static readonly Spade = 0x00_00_ff_00;
    public static readonly Diamond = 0x00_ff_00_00;
    public static readonly Club = 0xff_00_00_00;


    public static readonly SevenOfHearts = CardUtils.Seven * (CardUtils.Heart & CardUtils.SuiteMask);
    public static readonly EightOfHearts = CardUtils.Eight * (CardUtils.Heart & CardUtils.SuiteMask);
    public static readonly NineOfHearts = CardUtils.Nine * (CardUtils.Heart & CardUtils.SuiteMask);
    public static readonly ValetOfHearts = CardUtils.Valet * (CardUtils.Heart & CardUtils.SuiteMask);
    public static readonly QueenOfHearts = CardUtils.Queen * (CardUtils.Heart & CardUtils.SuiteMask);
    public static readonly KingOfHearts = CardUtils.King * (CardUtils.Heart & CardUtils.SuiteMask);
    public static readonly TenOfHearts = CardUtils.Ten * (CardUtils.Heart & CardUtils.SuiteMask);
    public static readonly ElevenOfHearts = CardUtils.Eleven * (CardUtils.Heart & CardUtils.SuiteMask);

    public static readonly SevenOfDiamonds = CardUtils.Seven * (CardUtils.Diamond & CardUtils.SuiteMask);
    public static readonly EightOfDiamonds = CardUtils.Eight * (CardUtils.Diamond & CardUtils.SuiteMask);
    public static readonly NineOfDiamonds = CardUtils.Nine * (CardUtils.Diamond & CardUtils.SuiteMask);
    public static readonly ValetOfDiamonds = CardUtils.Valet * (CardUtils.Diamond & CardUtils.SuiteMask);
    public static readonly QueenOfDiamonds = CardUtils.Queen * (CardUtils.Diamond & CardUtils.SuiteMask);
    public static readonly KingOfDiamonds = CardUtils.King * (CardUtils.Diamond & CardUtils.SuiteMask);
    public static readonly TenOfDiamonds = CardUtils.Ten * (CardUtils.Diamond & CardUtils.SuiteMask);
    public static readonly ElevenOfDiamonds = CardUtils.Eleven * (CardUtils.Diamond & CardUtils.SuiteMask);

    public static readonly SevenOfSpades = CardUtils.Seven * (CardUtils.Spade & CardUtils.SuiteMask);
    public static readonly EightOfSpades = CardUtils.Eight * (CardUtils.Spade & CardUtils.SuiteMask);
    public static readonly NineOfSpades = CardUtils.Nine * (CardUtils.Spade & CardUtils.SuiteMask);
    public static readonly ValetOfSpades = CardUtils.Valet * (CardUtils.Spade & CardUtils.SuiteMask);
    public static readonly QueenOfSpades = CardUtils.Queen * (CardUtils.Spade & CardUtils.SuiteMask);
    public static readonly KingOfSpades = CardUtils.King * (CardUtils.Spade & CardUtils.SuiteMask);
    public static readonly TenOfSpades = CardUtils.Ten * (CardUtils.Spade & CardUtils.SuiteMask);
    public static readonly ElevenOfSpades = CardUtils.Eleven * (CardUtils.Spade & CardUtils.SuiteMask);

    public static readonly SevenOfClubs = CardUtils.Seven * (CardUtils.Club & CardUtils.SuiteMask);
    public static readonly EightOfClubs = CardUtils.Eight * (CardUtils.Club & CardUtils.SuiteMask);
    public static readonly NineOfClubs = CardUtils.Nine * (CardUtils.Club & CardUtils.SuiteMask);
    public static readonly ValetOfClubs = CardUtils.Valet * (CardUtils.Club & CardUtils.SuiteMask);
    public static readonly QueenOfClubs = CardUtils.Queen * (CardUtils.Club & CardUtils.SuiteMask);
    public static readonly KingOfClubs = CardUtils.King * (CardUtils.Club & CardUtils.SuiteMask);
    public static readonly TenOfClubs = CardUtils.Ten * (CardUtils.Club & CardUtils.SuiteMask);
    public static readonly ElevenOfClubs = CardUtils.Eleven * (CardUtils.Club & CardUtils.SuiteMask);


    public static Suit(card: Card): number {
        if ((card & (card - 1)) != 0) throw 'the fnction [Suit(card: Card): number] does not accept decks';

        if (card & CardUtils.Heart) return CardUtils.Heart;
        else if (card & CardUtils.Spade) return CardUtils.Spade;
        else if (card & CardUtils.Diamond) return CardUtils.Diamond;
        else if (card & CardUtils.Club) return CardUtils.Club;

        throw new Error("invalid input " + card);
    }

    public static Rank(card: Card): number {
        if ((card & (card - 1)) != 0) throw 'the fnction [Rank(card: Card): number] does not accept decks';

        switch (CardUtils.Suit(card)) {
            case CardUtils.Heart: return card;
            case CardUtils.Spade: return card >>> 8;
            case CardUtils.Diamond: return card >>> 16;
            case CardUtils.Club: return card >>> 24;

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
            case 'h': suit = CardUtils.Heart; break;
            case 'd': suit = CardUtils.Diamond; break;
            case 's': suit = CardUtils.Spade; break;
            case 'c': suit = CardUtils.Club; break;
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
            case CardUtils.Heart: suit = 'H'; break;
            case CardUtils.Diamond: suit = 'D'; break;
            case CardUtils.Spade: suit = 'S'; break;
            case CardUtils.Club: suit = 'C'; break;
        }
        return rank + suit;
    }

    public static FromRankAndSuit(rank: number, suit: number) {
        return rank * (suit & CardUtils.SuiteMask);
    }
}