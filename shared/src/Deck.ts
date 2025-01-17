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

    public static Deal(): Array<number> {
        let handCount = new Array<number>(4);
        let hand = new Array<number>(4);
        handCount.fill(0,0,4);
        hand.fill(0,0,4);
        for (let i = 0; i < 32; i++) {
            let currentMask = 1 << i;
            let p;
            do{
                p = Math.floor(Math.random() * 4);
            }
            while(handCount[p] >= 8)
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
}