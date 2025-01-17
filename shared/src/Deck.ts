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
}