import { Card, CardUtils } from "./Card";

export type Deck = number;

export abstract class DeckUtils {
    public static readonly None = 0;
    public static readonly All = 0xff_ff_ff_ff;


    public static Count(Deck: Deck): number {
        let count = 0;
        for (let i = 0; i < 32; i++) {
            count += (Deck >> i) & 1;
        }
        return count;
    }


    public static Intersect(Deck1: Deck, Deck2: Deck): Deck {
        return Deck1 & Deck2;
    }


    public static Union(Deck1: Deck, Deck2: Deck): Deck {
        return Deck1 | Deck2;
    }


    public static Difference(Deck1: Deck, Deck2: Deck): Deck {
        return Deck1 & ~Deck2;
    }


    public static IsEmpty(Deck: Deck): boolean {
        return Deck === 0;
    }


    public static HighestTrumpRank(deck: Deck): number {
        deck |= deck >> 8;
        deck |= deck >> 16;
        deck |= deck >> 24;
        deck &= 0x00_00_00_ff;

        if (deck & CardUtils.Valet) return CardUtils.Valet;
        else if (deck & CardUtils.Nine) return CardUtils.Nine;
        for (let i = 128; i > 0; i = i >> 1) {
            if (deck & i) return i;
        }
        return DeckUtils.None
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
                result += CardUtils.ToString(currentMask) + ' ';
            }
        }
        return result.trim();
    }


    public static FromString(deck: string): number {
        let result = 0;
        const cards = deck.split(' ');
        for (const card of cards) {
            if (card) {
                result |= CardUtils.FromString(card);
            }
        }
        return result;
    }


    public static Value(Deck: number, Trump: number): number {
        let value = 0;
        for (let i = 0; i < 32; i++) {
            let currentMask = 1 << i;
            if ((Deck & currentMask) === 0) continue;
            value += (Trump & currentMask) ?
                CardUtils.TrumpValue(CardUtils.Rank(Deck & currentMask)) :
                CardUtils.PlainValue(CardUtils.Rank(Deck & currentMask));
        }
        return value;
    }
}