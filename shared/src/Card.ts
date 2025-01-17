export default abstract class Card {
    public static readonly Heart =     0x00_00_00_ff;
    public static readonly Diamond =   0x00_00_ff_00;
    public static readonly Spade =     0x00_ff_00_00;
    public static readonly Club =      0xff_00_00_00;

    public static readonly SuiteMask = 0x01_01_01_01;

    public static readonly Seven =     0b0000_0001;
    public static readonly Eight =     0b0000_0010;
    public static readonly Nine =      0b0000_0100;
    public static readonly Valet =     0b0000_1000;
    public static readonly Queen =     0b0001_0000;
    public static readonly King =      0b0010_0000;
    public static readonly Ten =       0b0100_0000;
    public static readonly Eleven =    0b1000_0000;

    public static readonly SevenOfHearts =     Card.Seven * (Card.Heart & Card.SuiteMask);
    public static readonly EightOfHearts =     Card.Eight * (Card.Heart & Card.SuiteMask);
    public static readonly NineOfHearts =      Card.Nine * (Card.Heart & Card.SuiteMask);
    public static readonly ValetOfHearts =     Card.Valet * (Card.Heart & Card.SuiteMask);
    public static readonly QueenOfHearts =     Card.Queen * (Card.Heart & Card.SuiteMask);
    public static readonly KingOfHearts =      Card.King * (Card.Heart & Card.SuiteMask);
    public static readonly TenOfHearts =       Card.Ten * (Card.Heart & Card.SuiteMask);
    public static readonly ElevenOfHearts =    Card.Eleven * (Card.Heart & Card.SuiteMask);

    public static readonly SevenOfDiamonds =     Card.Seven * (Card.Diamond & Card.SuiteMask);
    public static readonly EightOfDiamonds =     Card.Eight * (Card.Diamond & Card.SuiteMask);
    public static readonly NineOfDiamonds =      Card.Nine * (Card.Diamond & Card.SuiteMask);
    public static readonly ValetOfDiamonds =     Card.Valet * (Card.Diamond & Card.SuiteMask);
    public static readonly QueenOfDiamonds =     Card.Queen * (Card.Diamond & Card.SuiteMask);
    public static readonly KingOfDiamonds =      Card.King * (Card.Diamond & Card.SuiteMask);
    public static readonly TenOfDiamonds =       Card.Ten * (Card.Diamond & Card.SuiteMask);
    public static readonly ElevenOfDiamonds =    Card.Eleven * (Card.Diamond & Card.SuiteMask);

    public static readonly SevenOfSpades =     Card.Seven * (Card.Spade & Card.SuiteMask);
    public static readonly EightOfSpades =     Card.Eight * (Card.Spade & Card.SuiteMask);
    public static readonly NineOfSpades =      Card.Nine * (Card.Spade & Card.SuiteMask);
    public static readonly ValetOfSpades =     Card.Valet * (Card.Spade & Card.SuiteMask);
    public static readonly QueenOfSpades =     Card.Queen * (Card.Spade & Card.SuiteMask);
    public static readonly KingOfSpades =      Card.King * (Card.Spade & Card.SuiteMask);
    public static readonly TenOfSpades =       Card.Ten * (Card.Spade & Card.SuiteMask);
    public static readonly ElevenOfSpades =    Card.Eleven * (Card.Spade & Card.SuiteMask);

    public static readonly SevenOfClubs =     Card.Seven * (Card.Club & Card.SuiteMask);
    public static readonly EightOfClubs =     Card.Eight * (Card.Club & Card.SuiteMask);
    public static readonly NineOfClubs =      Card.Nine * (Card.Club & Card.SuiteMask);
    public static readonly ValetOfClubs =     Card.Valet * (Card.Club & Card.SuiteMask);
    public static readonly QueenOfClubs =     Card.Queen * (Card.Club & Card.SuiteMask);
    public static readonly KingOfClubs =      Card.King * (Card.Club & Card.SuiteMask);
    public static readonly TenOfClubs =       Card.Ten * (Card.Club & Card.SuiteMask);
    public static readonly ElevenOfClubs =    Card.Eleven * (Card.Club & Card.SuiteMask);

    /**
     * @param {number} card
     * @returns {number} Suit of the card
    */
    public static Suit(card: number): number {
        if (card & Card.Heart) return Card.Heart;
        else if (card & Card.Diamond) return Card.Diamond;
        else if (card & Card.Spade) return Card.Spade;
        else if (card & Card.Club) return Card.Club;

        throw new Error("invalid input " + card);
    }

    /**
     * @param {number} card
     * @returns {number} Rank of the card
     */
    public static Rank(card: number): number {
        switch (Card.Suit(card)) {
            case Card.Heart: return card;
            case Card.Diamond: return card >>> 8;
            case Card.Spade: return card >>> 16;
            case Card.Club: return card >>> 24;

            default: throw 'rank lookup: invalid call with param ' + card;
        }
    }

    public static PlainValue(card:number)
    {
        switch (card) {
            case Card.Seven: return 0;
            case Card.Eight: return 0;
            case Card.Nine: return 0;
            case Card.Valet: return 2;
            case Card.Queen: return 3;
            case Card.King: return 4;
            case Card.Ten: return 10;
            case Card.Eleven: return 11;
        
            default: throw 'value lookup: invalid call with param ' + card
        }
    }
    public static TrumpValue(card:number)
    {
        switch (card) {
            case Card.Seven: return 0;
            case Card.Eight: return 0;
            case Card.Nine: return 14;
            case Card.Valet: return 20;
            case Card.Queen: return 3;
            case Card.King: return 4;
            case Card.Ten: return 10;
            case Card.Eleven: return 11;
        
            default: throw 'value lookup: invalid call with param ' + card
        }
    }

    public static Value(Deck: number, Trump: number): number {
        let value = 0;
        for (let i = 0; i < 32; i++) {
            let currentMask = 1 << i;
            if((Deck & currentMask) === 0) continue;
            value += (Trump & currentMask) ?
                Card.TrumpValue(Card.Rank(Deck & currentMask)) :
                Card.PlainValue(Card.Rank(Deck & currentMask));
        }
        return value;
    }

    public static IsTrump(card: number, Trump: number): boolean {
        return (Trump & card) !== 0;
    }

    public static IsHigher(card1: number, card2: number, Trump: number): boolean {
        if (Card.IsTrump(card1, Trump) && !Card.IsTrump(card2, Trump)) return true;
        if (!Card.IsTrump(card1, Trump) && Card.IsTrump(card2, Trump)) return false;
        return Card.TrumpValue(card1) > Card.TrumpValue(card2);
    }

    public static FromString(card: string): number {
        if (card.length !== 2) throw 'invalid card string ' + card;
        let rank,suit;
        switch(card[0].toLocaleLowerCase()){
            case '7': rank = Card.Seven; break;
            case '8': rank = Card.Eight; break;
            case '9': rank = Card.Nine; break;
            case 'v': rank = Card.Valet; break;
            case 'q': rank = Card.Queen; break;
            case 'k': rank = Card.King; break;
            case 'x': rank = Card.Ten; break;
            case '1': rank = Card.Eleven; break;
            default: throw 'FromString: invalid rank ' + card[0];
        }
        switch(card[1].toLocaleLowerCase()){
            case 'h': suit = Card.Heart; break;
            case 'd': suit = Card.Diamond; break;
            case 's': suit = Card.Spade; break;
            case 'c': suit = Card.Club; break;
            default: throw 'FromString: invalid suit ' + card[1];
        }
        return rank * (suit & Card.SuiteMask);
    }

    public static ToString(card: number): string {
        let rank = '';
        switch (Card.Rank(card)) {
            case Card.Seven: rank = '7'; break;
            case Card.Eight: rank = '8'; break;
            case Card.Nine: rank = '9'; break;
            case Card.Valet: rank = 'V'; break;
            case Card.Queen: rank = 'Q'; break;
            case Card.King: rank = 'K'; break;
            case Card.Ten: rank = 'X'; break;
            case Card.Eleven: rank = '1'; break;
        }
        let suit = '';
        switch (Card.Suit(card)) {
            case Card.Heart: suit = 'H'; break;
            case Card.Diamond: suit = 'D'; break;
            case Card.Spade: suit = 'S'; break;
            case Card.Club: suit = 'C'; break;
        }
        return rank + suit;
    }
}