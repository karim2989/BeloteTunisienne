import Deck from '../src/Deck';

describe('Deck', () => {
    describe('ToString and FromString', () => {
        test('should correctly convert deck to string and back', () => {
            const originalDeck = 0b1010101; // random deck
            const deckString = Deck.ToString(originalDeck);
            const convertedDeck = Deck.FromString(deckString);
            expect(convertedDeck).toBe(originalDeck);
        });

        test('should handle empty deck', () => {
            const emptyDeck = Deck.None;
            const deckString = Deck.ToString(emptyDeck);
            expect(deckString).toBe('');
            expect(Deck.FromString(deckString)).toBe(emptyDeck);
        });

        test('should handle full deck', () => {
            const fullDeck = Deck.All;
            const deckString = Deck.ToString(fullDeck);
            expect(Deck.FromString(deckString) ^ fullDeck).toBe(0);
        });
    });

    describe('Deal', () => {
        test('should deal all cards', () => {
            const hands = Deck.Deal();
            expect(hands.length).toBe(4);
            
            const totalCards = hands.reduce((sum, hand) => sum + Deck.Count(hand), 0);
            expect(totalCards).toBe(32);
        });

        test('should deal 8 cards to each player', () => {
            const hands = Deck.Deal();
            hands.forEach(hand => {
                expect(Deck.Count(hand)).toBe(8);
            });
        });

        test('should not deal same card twice', () => {
            const hands = Deck.Deal();
            for(let i = 0; i < 3; i++) {
                for(let j = i + 1; j < 4; j++) {
                    expect(Deck.Intersect(hands[i], hands[j])).toBe(0);
                }
            }
        });
    });
});