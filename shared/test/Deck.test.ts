import { DeckUtils } from '../src/Deck';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('DeckUtils', () => {
    describe('ToString and FromString', () => {
        it('should correctly convert deck to string and back', () => {
            const originalDeck = 0b1010101; // random deck
            const deckString = DeckUtils.ToString(originalDeck);
            const convertedDeck = DeckUtils.FromString(deckString);
            assert.strictEqual(convertedDeck, originalDeck);
        });

        it('should handle empty deck', () => {
            const emptyDeck = DeckUtils.None;
            const deckString = DeckUtils.ToString(emptyDeck);
            assert.strictEqual(deckString, '');
            assert.strictEqual(DeckUtils.FromString(deckString), emptyDeck);
        });

        it('should handle full deck', () => {
            const fullDeck = DeckUtils.All;
            const deckString = DeckUtils.ToString(fullDeck);
            assert.strictEqual(DeckUtils.FromString(deckString) ^ fullDeck, 0);
        });
    });

    describe('Deal', () => {
        it('should deal all cards', () => {
            const hands = DeckUtils.Deal();
            assert.strictEqual(hands.length, 4);

            const totalCards = hands.reduce((sum, hand) => sum + DeckUtils.Count(hand), 0);
            assert.strictEqual(totalCards, 32);
        });

        it('should deal 8 cards to each player', () => {
            const hands = DeckUtils.Deal();
            hands.forEach(hand => {
                assert.strictEqual(DeckUtils.Count(hand), 8);
            });
        });

        it('should not deal same card twice', () => {
            const hands = DeckUtils.Deal();
            for (let i = 0; i < 3; i++) {
                for (let j = i + 1; j < 4; j++) {
                    assert.strictEqual(DeckUtils.Intersect(hands[i], hands[j]), 0);
                }
            }
        });
    });

    describe("returns highest card", () => {
        it('should return highest trump rank for various decks', () => {
            assert.strictEqual(DeckUtils.HighestTrumpRank(0xf0), 128);
            assert.strictEqual(DeckUtils.HighestTrumpRank(0xf0_00), 128);
            assert.strictEqual(DeckUtils.HighestTrumpRank(0xf0_00_00), 128);
            assert.strictEqual(DeckUtils.HighestTrumpRank(0x12), 16);
            assert.strictEqual(DeckUtils.HighestTrumpRank(0x12_00), 16);
            assert.strictEqual(DeckUtils.HighestTrumpRank(0x12_00_00), 16);
        });
    });
});