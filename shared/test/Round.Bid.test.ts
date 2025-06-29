/*import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import Round from "../src/Round";
import CardUtils from "../src/CardUtils";

describe('Round.Bid', () => {
    let round: Round;

    beforeEach(() => {
        round = new Round(0);
    });

    it('invalid bids are rejected', () => {
        // Invalid player
        round.Bid(-1, 1, 80, CardUtils.Heart);
        assert.equal(round.CurrentPlayer, 0);

        // Invalid bid type
        // @ts-expect-error
        round.Bid(0, 7, 80, CardUtils.Heart); 
        assert.equal(round.CurrentPlayer, 0);

        // Invalid bid value (not multiple of 10)
        round.Bid(0, 1, 85, CardUtils.Heart);
        assert.equal(round.CurrentPlayer, 0);
    });

    it('valid initial bid updates state', () => {
        round.Bid(0, 1, 90, CardUtils.Heart);
        assert.equal(round.CurrentPlayer, 1);
        assert.equal(round.CurrentBidType, 1);
        assert.equal(round.CurrentBidTrump, CardUtils.Heart);
        assert.equal(round.CurrentBidValue, 90);
        assert.equal(round.CurrentBidPlayer, 0);
    });

    it('higher bid from next player is accepted', () => {
        round.Bid(0, 1, 90, CardUtils.Heart);
        round.Bid(1, 1, 100, CardUtils.Diamond);
        assert.equal(round.CurrentPlayer, 2);
        assert.equal(round.CurrentBidTrump, CardUtils.Diamond);
        assert.equal(round.CurrentBidValue, 100);
        assert.equal(round.CurrentBidPlayer, 1);
    });

    it('lower bid is rejected', () => {
        round.Bid(0, 1, 90, CardUtils.Heart);
        round.Bid(1, 1, 80, CardUtils.Diamond);
        assert.equal(round.CurrentBidTrump, CardUtils.Heart);
        assert.equal(round.CurrentBidValue, 90);
        assert.equal(round.CurrentBidPlayer, 0);
    });

    it('contre can only follow annonce', () => {
        round.Bid(0, 2, 90, CardUtils.Heart); // Contre without annonce
        assert.equal(round.CurrentBidType, 0);

        round.Bid(0, 1, 90, CardUtils.Heart); // Valid annonce
        round.Bid(1, 2, 90, CardUtils.Heart); // Valid contre
        assert.equal(round.CurrentBidType, 2);
        assert.equal(round.CurrentBidPlayer, 1);
    });

    it('surcontre can only follow contre', () => {
        round.Bid(0, 3, 90, CardUtils.Heart); // Surcontre without contre
        assert.equal(round.CurrentBidType, 0);

        round.Bid(1, 1, 90, CardUtils.Heart); // Valid annonce
        assert.equal(round.CurrentBidType, 1);
        round.Bid(2, 2, 90, CardUtils.Heart); // Valid contre
        assert.equal(round.CurrentBidType, 2);
        round.Bid(3, 3, 90, CardUtils.Heart); // Valid surcontre
        assert.equal(round.CurrentBidType, 3);
        assert.equal(round.CurrentBidPlayer, 3);
    });

    it('bid phase ends when first bidder is reached', () => {
        round.Bid(0, 1, 90, CardUtils.Heart);
        round.Bid(1, 0, 0, CardUtils.Heart); // Pass
        round.Bid(2, 0, 0, CardUtils.Heart); // Pass  
        round.Bid(3, 0, 0, CardUtils.Heart); // Pass
        assert.equal(round.CurrentPlayer, 0);
        assert.equal(round.RoundState, 1); // inbetweenphase
    });

    // TODO: multiple passes should be accepted

    it('bid value must be between 90 and 180', () => {
        round.Bid(0, 1, 70, CardUtils.Heart); // Too low
        assert.equal(round.CurrentPlayer, 0);
        
        round.Bid(0, 1, 190, CardUtils.Heart); // Too high
        assert.equal(round.CurrentPlayer, 0);
        
        round.Bid(0, 1, 90, CardUtils.Heart); // Valid
        assert.equal(round.CurrentPlayer, 1);
    });
});*/