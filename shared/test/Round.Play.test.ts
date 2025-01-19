import Round from "../src/Round";
import Card from "../src/Card";

describe('Round.Play basic tests', () => {
    let round: Round;

    beforeEach(() => {
        round = new Round(0);
        round.Bid(0, 1, 90, Card.Heart);
        round.Bid(1, 0, 0, 0);
        round.Bid(2, 0, 0, 0);
        round.Bid(3, 0, 0, 0);
    });

    it('should reject play from wrong player', () => {
        const result = round.Play(1, Card.SevenOfHearts);
        expect(result).toBe(false);
    });

    it('should accept valid play from current player', () => {
        const result = round.Play(0, round.Hands[0] | 0x01);
        expect(result).toBe(true);
    });

    it('should advance to next player after valid play', () => {
        round.Play(0, round.Hands[0] | 0x01);
        expect(round.CurrentPlayer).toBe(1);
    });

});


describe("simulate round", () => test.todo("sumulate round"))