import Round from "../src/Round";
import { CardUtils } from "../src/Card";
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Bid, BidType } from "./Bid";
describe('Round.Play basic tests', () => {
    let round;
    beforeEach(() => {
        round = new Round(0);
        round.Bid(new Bid(0, BidType.annonce, CardUtils.Heart, 90));
        round.Bid(new Bid(1, BidType.pass));
        round.Bid(new Bid(2, BidType.pass));
        round.Bid(new Bid(3, BidType.pass));
    });
    it('should reject play from wrong player', () => {
        const result = round.Play(1, CardUtils.SevenOfHearts);
        assert.equal(result, false);
    });
    it('should accept valid play from current player', () => {
        const result = round.Play(0, round.Hands[0] | 0x01);
        assert.equal(result, true);
    });
    it('should advance to next player after valid play', () => {
        round.Play(0, round.Hands[0] | 0x01);
        assert.equal(round.CurrentPlayer, 1);
    });
});
