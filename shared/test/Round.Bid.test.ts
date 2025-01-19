import Round from "../src/Round";
import Card from "../src/Card";

describe('Round.Bid', () => {
    let round: Round;

    beforeEach(() => {
        round = new Round(0);
    });

    test('invalid bids are rejected', () => {
        // Invalid player
        round.Bid(-1, 1, 80, Card.Heart);
        expect(round.CurrentPlayer).toBe(0);

        // Invalid bid type
        ///@ts-expect-error
        round.Bid(0, 7, 80, Card.Heart); 
        expect(round.CurrentPlayer).toBe(0);

        // Invalid bid value (not multiple of 10)
        round.Bid(0, 1, 85, Card.Heart);
        expect(round.CurrentPlayer).toBe(0);
    });

    test('valid initial bid updates state', () => {
        round.Bid(0, 1, 90, Card.Heart);
        expect(round.CurrentPlayer).toBe(1);
        expect(round.CurrentBidType).toBe(1);
        expect(round.CurrentBidTrump).toBe(Card.Heart);
        expect(round.CurrentBidValue).toBe(90);
        expect(round.CurrentBidPlayer).toBe(0);
    });

    test('higher bid from next player is accepted', () => {
        round.Bid(0, 1, 90, Card.Heart);
        round.Bid(1, 1, 100, Card.Diamond);
        expect(round.CurrentPlayer).toBe(2);
        expect(round.CurrentBidTrump).toBe(Card.Diamond);
        expect(round.CurrentBidValue).toBe(100);
        expect(round.CurrentBidPlayer).toBe(1);
    });

    test('lower bid is rejected', () => {
        round.Bid(0, 1, 90, Card.Heart);
        round.Bid(1, 1, 80, Card.Diamond);
        expect(round.CurrentBidTrump).toBe(Card.Heart);
        expect(round.CurrentBidValue).toBe(90);
        expect(round.CurrentBidPlayer).toBe(0);
    });

    test('contre can only follow annonce', () => {
        round.Bid(0, 2, 90, Card.Heart); // Contre without annonce
        expect(round.CurrentBidType).toBe(0);

        round.Bid(0, 1, 90, Card.Heart); // Valid annonce
        round.Bid(1, 2, 90, Card.Heart); // Valid contre
        expect(round.CurrentBidType).toBe(2);
        expect(round.CurrentBidPlayer).toBe(1);
    });

    test('surcontre can only follow contre', () => {
        round.Bid(0, 3, 90, Card.Heart); // Surcontre without contre
        expect(round.CurrentBidType).toBe(0);

        round.Bid(1, 1, 90, Card.Heart); // Valid annonce
        expect(round.CurrentBidType).toBe(1);
        round.Bid(2, 2, 90, Card.Heart); // Valid contre
        expect(round.CurrentBidType).toBe(2);
        round.Bid(3, 3, 90, Card.Heart); // Valid surcontre
        expect(round.CurrentBidType).toBe(3);
        expect(round.CurrentBidPlayer).toBe(3);
    });

    test('bid phase ends when first bidder is reached', () => {
        round.Bid(0, 1, 90, Card.Heart);
        round.Bid(1, 0, 0, Card.Heart); // Pass
        round.Bid(2, 0, 0, Card.Heart); // Pass  
        round.Bid(3, 0, 0, Card.Heart); // Pass
        expect(round.CurrentPlayer).toBe(0);
        expect(round.RoundState).toBe(1); // inbetweenphase
    });

    test.todo('multiple passes should be accepted');
    
    test('bid value must be between 90 and 180', () => {
        round.Bid(0, 1, 70, Card.Heart); // Too low
        expect(round.CurrentPlayer).toBe(0);
        
        round.Bid(0, 1, 190, Card.Heart); // Too high
        expect(round.CurrentPlayer).toBe(0);
        
        round.Bid(0, 1, 90, Card.Heart); // Valid
        expect(round.CurrentPlayer).toBe(1);
    });
});