import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CardUtils } from '../src/Card';
import { DeckUtils } from '../src/Deck';

describe('Card', () => {
    describe('Count', () => {
        it('should return 0 for empty deck', () => {
            assert.strictEqual(DeckUtils.Count(DeckUtils.None), 0);
        });

        it('should return 8 for a full suit', () => {
            assert.strictEqual(DeckUtils.Count(CardUtils.Heart), 8);
        });

        it('should return 32 for all cards', () => {
            assert.strictEqual(DeckUtils.Count(DeckUtils.All), 32);
        });
    });

    describe('Value Lookups', () => {
        it('should return correct value', () => {
            assert.strictEqual(CardUtils.PlainValue(CardUtils.Seven), 0);
            assert.strictEqual(CardUtils.PlainValue(CardUtils.Eight), 0);
            assert.strictEqual(CardUtils.PlainValue(CardUtils.Nine), 0);
            assert.strictEqual(CardUtils.PlainValue(CardUtils.Valet), 2);
            assert.strictEqual(CardUtils.PlainValue(CardUtils.Queen), 3);
            assert.strictEqual(CardUtils.PlainValue(CardUtils.King), 4);
            assert.strictEqual(CardUtils.PlainValue(CardUtils.Ten), 10);
            assert.strictEqual(CardUtils.PlainValue(CardUtils.Eleven), 11);

            assert.strictEqual(CardUtils.TrumpValue(CardUtils.Seven), 0);
            assert.strictEqual(CardUtils.TrumpValue(CardUtils.Eight), 0);
            assert.strictEqual(CardUtils.TrumpValue(CardUtils.Nine), 14);
            assert.strictEqual(CardUtils.TrumpValue(CardUtils.Valet), 20);
            assert.strictEqual(CardUtils.TrumpValue(CardUtils.Queen), 3);
            assert.strictEqual(CardUtils.TrumpValue(CardUtils.King), 4);
            assert.strictEqual(CardUtils.TrumpValue(CardUtils.Ten), 10);
            assert.strictEqual(CardUtils.TrumpValue(CardUtils.Eleven), 11);
        });
    });

    describe('Rank and Suit', () => {
        it('should extract rank correctly', () => {
            assert.strictEqual(CardUtils.Rank(CardUtils.ValetOfHearts), CardUtils.Valet);
            assert.strictEqual(CardUtils.Rank(CardUtils.TenOfSpades), CardUtils.Ten);
            assert.strictEqual(CardUtils.Rank(CardUtils.KingOfDiamonds), CardUtils.King);
            assert.strictEqual(CardUtils.Rank(CardUtils.SevenOfClubs), CardUtils.Seven);
            assert.strictEqual(CardUtils.Rank(CardUtils.EightOfHearts), CardUtils.Eight);
            assert.strictEqual(CardUtils.Rank(CardUtils.NineOfDiamonds), CardUtils.Nine);
            assert.strictEqual(CardUtils.Rank(CardUtils.QueenOfSpades), CardUtils.Queen);
            assert.strictEqual(CardUtils.Rank(CardUtils.ElevenOfClubs), CardUtils.Eleven);
        });

        it('should extract suit correctly', () => {
            assert.strictEqual(CardUtils.Suit(CardUtils.ValetOfHearts), CardUtils.Heart);
            assert.strictEqual(CardUtils.Suit(CardUtils.TenOfSpades), CardUtils.Spade);
            assert.strictEqual(CardUtils.Suit(CardUtils.KingOfDiamonds), CardUtils.Diamond);
            assert.strictEqual(CardUtils.Suit(CardUtils.SevenOfClubs), CardUtils.Club);
            assert.strictEqual(CardUtils.Suit(CardUtils.NineOfHearts), CardUtils.Heart);
            assert.strictEqual(CardUtils.Suit(CardUtils.QueenOfDiamonds), CardUtils.Diamond);
            assert.strictEqual(CardUtils.Suit(CardUtils.EightOfSpades), CardUtils.Spade);
            assert.strictEqual(CardUtils.Suit(CardUtils.ElevenOfClubs), CardUtils.Club);
        });

        it('should throw error for invalid cards', () => {
            assert.throws(() => CardUtils.Rank(DeckUtils.None));
            assert.throws(() => CardUtils.Suit(DeckUtils.None));
        });
    });

    describe('Value', () => {
        it('should calculate plain card values correctly', () => {
            assert.strictEqual(DeckUtils.Value(CardUtils.ValetOfHearts, CardUtils.Diamond), 2);
            assert.strictEqual(DeckUtils.Value(CardUtils.TenOfSpades, CardUtils.Heart), 10);
        });

        it('should calculate trump card values correctly', () => {
            assert.strictEqual(DeckUtils.Value(CardUtils.ValetOfDiamonds, CardUtils.Diamond), 20);
            assert.strictEqual(DeckUtils.Value(CardUtils.NineOfHearts, CardUtils.Heart), 14);
        });

        it('should calculate deck values correctly', () => {
            const deck = DeckUtils.Union(CardUtils.ValetOfHearts, CardUtils.NineOfHearts);
            assert.strictEqual(DeckUtils.Value(deck, CardUtils.Heart), 34); // Trump Valet(20) + Trump Nine(14)
        });
    });

    describe('Set operations', () => {
        it('should correctly intersect two decks', () => {
            const deck1 = DeckUtils.Union(CardUtils.ValetOfHearts, CardUtils.KingOfHearts);
            const deck2 = DeckUtils.Union(CardUtils.KingOfHearts, CardUtils.TenOfHearts);
            assert.strictEqual(DeckUtils.Count(DeckUtils.Intersect(deck1, deck2)), 1);
        });

        it('should correctly union two decks', () => {
            const deck1 = DeckUtils.Union(CardUtils.ValetOfHearts, CardUtils.KingOfHearts);
            const deck2 = DeckUtils.Union(CardUtils.KingOfHearts, CardUtils.TenOfHearts);
            assert.strictEqual(DeckUtils.Count(DeckUtils.Union(deck1, deck2)), 3);
        });
    });
    describe('deck comparison', () => {
        assert.strictEqual(CardUtils.IsSuit(CardUtils.ValetOfClubs, CardUtils.Club), true);
        assert.strictEqual(CardUtils.IsSuit(CardUtils.ValetOfClubs, CardUtils.Diamond), false);
        assert.strictEqual(CardUtils.IsSuit(CardUtils.ValetOfClubs, DeckUtils.All), true);
        assert.strictEqual(CardUtils.IsSuit(CardUtils.ValetOfClubs, DeckUtils.None), false);

        assert.strictEqual(CardUtils.Compare(CardUtils.QueenOfHearts, CardUtils.NineOfClubs, DeckUtils.None), true);
        assert.strictEqual(CardUtils.Compare(CardUtils.QueenOfHearts, CardUtils.NineOfClubs, DeckUtils.All), false);
    });
});