"use strict";
/*import Trick from "../src/Trick";
import {Card @ from "../src/Card";
import Deck from "../src/Deck";

describe("Simulated trick chain 1 :", () => {
    let hands = new Int32Array([
        Deck.FromString("7H 8H QH 1H XD 7C QC KC"),
        Deck.FromString("9H XH VD 1D 7S QS KS 1S"),
        Deck.FromString("7D 8D 8S 9S VS 8C VC XC"),
        Deck.FromString("VH KH 9D QD KD XS 9C 1C")
    ])
    let trick;
    test("Simulated trick 1", () => {
        trick = new Trick(Card.Diamond);
        expect(trick.tryPlayCard(Card.ElevenOfHearts, hands[0])).toBeTruthy();
        hands[0] = Deck.Difference(hands[0], Card.ElevenOfHearts);

        expect(trick.tryPlayCard(Card.ElevenOfClubs, hands[1])).toBe(false);
        expect(trick.tryPlayCard(Card.ValetOfDiamonds, hands[1])).toBe(false);
        expect(trick.tryPlayCard(Card.NineOfHearts, hands[1])).toBe(true);
        hands[1] = Deck.Difference(hands[1], Card.NineOfHearts);

        expect(trick.tryPlayCard(Card.SevenOfDiamonds, hands[2])).toBe(true);
        hands[2] = Deck.Difference(hands[2], Card.SevenOfDiamonds);

        expect(trick.tryPlayCard(Card.NineOfDiamonds, hands[3])).toBe(false);
        expect(trick.tryPlayCard(Card.KingOfHearts, hands[3])).toBe(true);
        hands[3] = Deck.Difference(hands[3], Card.KingOfHearts);

        expect(trick.WinningPlayIndex).toBe(2);
    })
    test("Simulated trick 2", () => {
        trick = new Trick(Card.Diamond);
        expect(trick.tryPlayCard(Card.EightOfSpades, hands[2])).toBe(true);
        hands[2] = Deck.Difference(hands[2], Card.EightOfSpades);

        expect(trick.tryPlayCard(Card.NineOfDiamonds, hands[3])).toBe(false);
        expect(trick.tryPlayCard(Card.TenOfSpades, hands[3])).toBe(true);
        hands[3] = Deck.Difference(hands[3], Card.TenOfSpades);

        expect(trick.tryPlayCard(Card.KingOfClubs, hands[0])).toBe(false);
        expect(trick.tryPlayCard(Card.SevenOfHearts, hands[0])).toBe(false);
        expect(trick.tryPlayCard(Card.TenOfDiamonds, hands[0])).toBe(true);
        hands[0] = Deck.Difference(hands[0], Card.TenOfDiamonds);

        expect(trick.tryPlayCard(Card.ValetOfDiamonds, hands[1])).toBe(false);
        expect(trick.tryPlayCard(Card.SevenOfSpades, hands[1])).toBe(true);
        hands[1] = Deck.Difference(hands[1], Card.SevenOfSpades);
        
        expect(trick.WinningPlayIndex).toBe(2);
    });
});


describe('Other trick tests', () => {
    let trick: Trick;

    beforeEach(() => {
        trick = new Trick(Card.Heart);
    });

    describe('tryPlayCard', () => {
        it('should reject card not in hand', () => {
            const hand = Card.ElevenOfHearts;
            expect(trick.tryPlayCard(Card.ElevenOfSpades, hand)).toBe(false);
        });

        it('should allow any first card', () => {
            const hand = Card.ElevenOfHearts;
            expect(trick.tryPlayCard(Card.ElevenOfHearts, hand)).toBeTruthy();
        });

        it('should allow following suit', () => {
            const firstHand = Card.ElevenOfHearts;
            trick.tryPlayCard(Card.ElevenOfHearts, firstHand);

            const secondHand = Card.KingOfHearts;
            expect(trick.tryPlayCard(Card.KingOfHearts, secondHand)).toBeTruthy();
        });

        it('should allow playing different suit when no leading suit available', () => {
            const firstHand = Card.ElevenOfHearts;
            trick.tryPlayCard(Card.ElevenOfHearts, firstHand);

            const secondHand = Card.ElevenOfSpades;
            expect(trick.tryPlayCard(Card.ElevenOfSpades, secondHand)).toBeTruthy();
        });

        it('should require trump when possible if losing', () => {
            trick = new Trick(Card.Heart);
            const firstHand = Card.ElevenOfSpades;
            trick.tryPlayCard(Card.ElevenOfSpades, firstHand);

            const secondHand = (Card.ElevenOfDiamonds) | (Card.KingOfHearts);
            expect(trick.tryPlayCard(Card.ElevenOfDiamonds, secondHand)).toBe(false);
        });

        it('over ruffing', () => {
            trick = new Trick(Card.Heart);
            const firstHand = Card.ElevenOfHearts;
            trick.tryPlayCard(Card.ElevenOfHearts, firstHand);

            const secondHand = Card.NineOfHearts;
            expect(trick.tryPlayCard(Card.NineOfHearts, secondHand)).toBe(true);
        });
        it('under ruffing', () => {
            trick = new Trick(Card.Heart);
            const firstHand = Card.ElevenOfHearts;
            trick.tryPlayCard(Card.ElevenOfHearts, firstHand);

            const secondHand = Card.SevenOfHearts;
            expect(trick.tryPlayCard(Card.SevenOfHearts, secondHand)).toBeTruthy();
        });
        
        it('should reject under ruffing when higher trump available', () => {
            trick = new Trick(Card.Heart);
            const firstHand = Card.ElevenOfHearts;
            trick.tryPlayCard(Card.ElevenOfHearts, firstHand);

            const secondHand = (Card.NineOfHearts) | (Card.TenOfHearts);
            expect(trick.tryPlayCard(Card.TenOfHearts, secondHand)).toBe(false);
            expect(trick.tryPlayCard(Card.NineOfHearts, secondHand)).toBe(true);
        });
    });
});*/ 
