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
        expect(round.Dump()).toContain("current player: 0");

        // Invalid bid type
        ///@ts-expect-error
        round.Bid(0, 7, 80, Card.Heart); 
        expect(round.Dump()).toContain("current player: 0");

        // Invalid bid value (not multiple of 10)
        round.Bid(0, 1, 85, Card.Heart);
        expect(round.Dump()).toContain("current player: 0");
    });

    test('valid initial bid updates state', () => {
        round.Bid(0, 1, 80, Card.Heart);
        const dump = round.Dump();
        expect(dump).toContain("current player: 1");
        expect(dump).toContain("bid information:\n1 255 80 0");
    });

    test('higher bid from next player is accepted', () => {
        round.Bid(0, 1, 80, Card.Heart);
        round.Bid(1, 1, 90, Card.Diamond);
        const dump = round.Dump();
        expect(dump).toContain("current player: 2");
        expect(dump).toContain("bid information:\n1 65280 90 1");
    });

    test('lower bid is rejected', () => {
        round.Bid(0, 1, 90, Card.Heart);
        round.Bid(1, 1, 80, Card.Diamond);
        const dump = round.Dump();
        expect(dump).toContain("bid information:\n1 255 90 0");
    });

    test('contre can only follow annonce', () => {
        round.Bid(0, 2, 80, Card.Heart); // Contre without annonce
        expect(round.Dump()).toContain("bid information:\n0 0 0 0");

        round.Bid(0, 1, 80, Card.Heart); // Valid annonce
        round.Bid(1, 2, 80, Card.Heart); // Valid contre
        expect(round.Dump()).toContain("bid information:\n2 255 80 1");
    });
});