import Card from "./Card";

export default abstract class Deck {
    public static readonly None = 0;
    public static readonly All = 0xff_ff_ff_ff;

    public static Count(Deck: number): number {
        let count = 0;
        for (let i = 0; i < 32; i++) {
            count += (Deck >> i) & 1;
        }
        return count;
    }
    /**
     * @param {number} Deck1
     * @param {number} Deck2
     * @returns {number} intersection of two decks
     */
    public static Intersect(Deck1: number, Deck2: number): number {
        return Deck1 & Deck2;
    }
    /**
     * @param {number} Deck1
     * @param {number} Deck2
     * @returns {number} union of two decks
     */
    public static Union(Deck1: number, Deck2: number): number {
        return Deck1 | Deck2;
    }
    /**
     * @param {number} Deck1
     * @param {number} Deck2
     * @returns {number} difference of two decks
     */
    public static Difference(Deck1: number, Deck2: number): number {
        return Deck1 & ~Deck2;
    }

    public static IsEmpty(Deck: number): boolean {
        return Deck === 0;
    }

    public static HighestTrumpRank(deck: number): number {
        deck |= deck >> 8;
        deck |= deck >> 16;
        deck |= deck >> 24;
        deck &= 0x00_00_00_ff;
        if(deck & Card.Valet) return Card.Valet;
        else if(deck & Card.Nine) return Card.Nine;
        for (let i = 128; i > 0; i = i >> 1) {
            if (deck & i) return i;
        }
        return Deck.None
    }

    public static Deal(): Int32Array {
        let handCount = new Int32Array(4);
        let hand = new Int32Array(4);
        handCount.fill(0, 0, 4);
        hand.fill(0, 0, 4);
        for (let i = 0; i < 32; i++) {
            let currentMask = 1 << i;
            let p;
            do {
                p = Math.floor(Math.random() * 4);
            }
            while (handCount[p] >= 8)
            hand[p] = hand[p] | currentMask;
            handCount[p]++;
        }
        return hand;
    }

    public static ToString(deck: number): string {
        let result = '';
        for (let i = 0; i < 32; i++) {
            let currentMask = 1 << i;
            if (deck & currentMask) {
                result += Card.ToString(currentMask) + ' ';
            }
        }
        return result.trim();
    }

    public static FromString(deck: string): number {
        let result = 0;
        const cards = deck.split(' ');
        for (const card of cards) {
            if (card) {
                result |= Card.FromString(card);
            }
        }
        return result;
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
}