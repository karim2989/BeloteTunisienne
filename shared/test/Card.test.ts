import Card from '../src/Card';
import Deck from '../src/Deck';

describe('Card', () => {
    describe('Count', () => {
        it('should return 0 for empty deck', () => {
            expect(Deck.Count(Deck.None)).toBe(0);
        });

        it('should return 8 for a full suit', () => {
            expect(Deck.Count(Card.Heart)).toBe(8);
        });

        it('should return 32 for all cards', () => {
            expect(Deck.Count(Deck.All)).toBe(32);
        });
    });

    describe('Value Lookups', () => {
        it('should return correct value', () => {
            expect(Card.PlainValue(Card.Seven)).toBe(0);
            expect(Card.PlainValue(Card.Eight)).toBe(0);
            expect(Card.PlainValue(Card.Nine)).toBe(0);
            expect(Card.PlainValue(Card.Valet)).toBe(2);
            expect(Card.PlainValue(Card.Queen)).toBe(3);
            expect(Card.PlainValue(Card.King)).toBe(4);
            expect(Card.PlainValue(Card.Ten)).toBe(10);
            expect(Card.PlainValue(Card.Eleven)).toBe(11);

            expect(Card.TrumpValue(Card.Seven)).toBe(0);
            expect(Card.TrumpValue(Card.Eight)).toBe(0);
            expect(Card.TrumpValue(Card.Nine)).toBe(14);
            expect(Card.TrumpValue(Card.Valet)).toBe(20);
            expect(Card.TrumpValue(Card.Queen)).toBe(3);
            expect(Card.TrumpValue(Card.King)).toBe(4);
            expect(Card.TrumpValue(Card.Ten)).toBe(10);
            expect(Card.TrumpValue(Card.Eleven)).toBe(11);
        });
    });

    describe('Rank and Suit', () => {
        it('should extract rank correctly', () => {
            expect(Card.Rank(Card.ValetOfHearts)).toBe(Card.Valet);
            expect(Card.Rank(Card.TenOfSpades)).toBe(Card.Ten);
            expect(Card.Rank(Card.KingOfDiamonds)).toBe(Card.King);
            expect(Card.Rank(Card.SevenOfClubs)).toBe(Card.Seven);
            expect(Card.Rank(Card.EightOfHearts)).toBe(Card.Eight);
            expect(Card.Rank(Card.NineOfDiamonds)).toBe(Card.Nine);
            expect(Card.Rank(Card.QueenOfSpades)).toBe(Card.Queen);
            expect(Card.Rank(Card.ElevenOfClubs)).toBe(Card.Eleven);
        });
        
        it('should extract suit correctly', () => {
            expect(Card.Suit(Card.ValetOfHearts)).toBe(Card.Heart);
            expect(Card.Suit(Card.TenOfSpades)).toBe(Card.Spade); 
            expect(Card.Suit(Card.KingOfDiamonds)).toBe(Card.Diamond);
            expect(Card.Suit(Card.SevenOfClubs)).toBe(Card.Club);
            expect(Card.Suit(Card.NineOfHearts)).toBe(Card.Heart);
            expect(Card.Suit(Card.QueenOfDiamonds)).toBe(Card.Diamond);
            expect(Card.Suit(Card.EightOfSpades)).toBe(Card.Spade);
            expect(Card.Suit(Card.ElevenOfClubs)).toBe(Card.Club);
        });

        it('should throw error for invalid cards', () => {
            expect(() => Card.Rank(Deck.None)).toThrow();
            expect(() => Card.Suit(Deck.None)).toThrow();
        });
    });

    describe('Value', () => {
        it('should calculate plain card values correctly', () => {
            expect(Card.Value(Card.ValetOfHearts, Card.Diamond)).toBe(2);
            expect(Card.Value(Card.TenOfSpades, Card.Heart)).toBe(10);
        });

        it('should calculate trump card values correctly', () => {
            expect(Card.Value(Card.ValetOfDiamonds, Card.Diamond)).toBe(20);
            expect(Card.Value(Card.NineOfHearts, Card.Heart)).toBe(14);
        });

        it('should calculate deck values correctly', () => {
            const deck = Deck.Union(Card.ValetOfHearts, Card.NineOfHearts);
            expect(Card.Value(deck, Card.Heart)).toBe(34); // Trump Valet(20) + Trump Nine(14)
        });
    });

    describe('Set operations', () => {
        it('should correctly intersect two decks', () => {
            const deck1 = Deck.Union(Card.ValetOfHearts, Card.KingOfHearts);
            const deck2 = Deck.Union(Card.KingOfHearts, Card.TenOfHearts);
            expect(Deck.Count(Deck.Intersect(deck1, deck2))).toBe(1);
        });

        it('should correctly union two decks', () => {
            const deck1 = Deck.Union(Card.ValetOfHearts, Card.KingOfHearts);
            const deck2 = Deck.Union(Card.KingOfHearts, Card.TenOfHearts);
            expect(Deck.Count(Deck.Union(deck1, deck2))).toBe(3);
        });
    });
});