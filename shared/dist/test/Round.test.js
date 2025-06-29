import Round from "../src/Round";
import { CardUtils } from "../src/Card";
import { DeckUtils } from "../src/Deck";
import { Bid, BidType } from "../src/Bid";
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
describe('Round full game simulation', () => {
    let round;
    const predefinedHands = [
        "1c 9s 8s 8h vd qs 7h 7d",
        "9h 1s xs 1h vh kh qd 7c",
        "kc 8c 9c 8d xd 1d kd xc",
        "7s vc qc 9d vs qh ks xh"
    ];
    it("hands should be correctly typed", () => {
        let joinedHands = DeckUtils.FromString(predefinedHands[0]) |
            DeckUtils.FromString(predefinedHands[1]) |
            DeckUtils.FromString(predefinedHands[2]) |
            DeckUtils.FromString(predefinedHands[3]);
        assert.equal(DeckUtils.Difference(joinedHands, DeckUtils.All), 0);
    });
    beforeEach(() => {
        round = new Round(0, predefinedHands);
    });
    it('bidding phase follows correct sequence', () => {
        assert.equal(round.RoundState, 0); // bidphase
        // Player 0 bids 90 Hearts
        assert.equal(round.Bid(new Bid(0, BidType.annonce, CardUtils.Heart, 90)), true);
        assert.equal(round.CurrentBid.Type, BidType.annonce);
        assert.equal(round.CurrentBid.Value, 90);
        assert.equal(round.CurrentBid.Trump, CardUtils.Heart);
        // Others pass
        assert.equal(round.Bid(new Bid(1, BidType.pass)), true);
        assert.equal(round.Bid(new Bid(2, BidType.pass)), true);
        assert.equal(round.Bid(new Bid(3, BidType.pass)), true);
        assert.equal(round.RoundState, 1); // inbetweenphase
        assert.equal(round.CurrentPlayer, 0);
    });
    it('full game simulation results in valid state', () => {
        // Bidding phase
        round.Bid(new Bid(0, BidType.pass));
        round.Bid(new Bid(1, BidType.annonce, CardUtils.Heart, 100));
        round.Bid(new Bid(2, BidType.pass));
        round.Bid(new Bid(3, BidType.pass));
        round.Bid(new Bid(0, BidType.pass));
        const plays = [
            [CardUtils.ElevenOfClubs, CardUtils.SevenOfClubs, CardUtils.TenOfClubs, CardUtils.ValetOfClubs],
            [CardUtils.SevenOfDiamonds, CardUtils.QueenOfDiamonds, CardUtils.ElevenOfDiamonds, CardUtils.NineOfDiamonds],
            [CardUtils.EightOfClubs, CardUtils.QueenOfClubs, CardUtils.SevenOfHearts, CardUtils.KingOfHearts],
            [CardUtils.ValetOfHearts, CardUtils.EightOfDiamonds, CardUtils.TenOfHearts, CardUtils.EightOfHearts],
            [CardUtils.NineOfHearts, CardUtils.NineOfClubs, CardUtils.QueenOfHearts, CardUtils.EightOfSpades],
            [CardUtils.ElevenOfSpades, CardUtils.KingOfClubs, CardUtils.KingOfSpades, CardUtils.QueenOfSpades],
            [CardUtils.TenOfSpades, CardUtils.TenOfDiamonds, CardUtils.ValetOfSpades, CardUtils.NineOfSpades],
            [CardUtils.ElevenOfHearts, CardUtils.KingOfDiamonds, CardUtils.SevenOfSpades, CardUtils.ValetOfDiamonds],
        ];
        const winners = [0, 2, 1, 1, 1, 1, 1, 1];
        for (let i = 0; i < plays.length; i++) {
            const play = plays[i];
            assert.equal(round.Play(round.CurrentPlayer, play[0]), true);
            assert.equal(round.Play(round.CurrentPlayer, play[1]), true);
            assert.equal(round.Play(round.CurrentPlayer, play[2]), true);
            assert.equal(round.Play(round.CurrentPlayer, play[3]), true);
            assert.equal(round.CurrentPlayer, winners[i]);
        }
        // Verify final state
        assert.equal(DeckUtils.Count(round.Hands[0]), 0);
        assert.equal(DeckUtils.Count(round.Hands[1]), 0);
        assert.equal(DeckUtils.Count(round.Hands[2]), 0);
        assert.equal(DeckUtils.Count(round.Hands[3]), 0);
        assert.equal(round.Tricks.length, 8);
    });
});
