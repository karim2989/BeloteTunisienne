import Round from "../src/Round";
import Card from "../src/Card";
import Deck from "../src/Deck";

describe('Round full game simulation', () => {
    let round: Round;

    const predefinedHands = [
        "1c 9s 8s 8h vd qs 7h 7d",
        "9h 1s xs 1h vh kh qd 7c",
        "kc 8c 9c 8d xd 1d kd xc",
        "7s vc qc 9d vs qh ks xh"
    ];
    test("hands should be correctly typed",()=>{
        let joinedHands = Deck.FromString(predefinedHands[0]) |
            Deck.FromString(predefinedHands[1]) |
            Deck.FromString(predefinedHands[2]) |
            Deck.FromString(predefinedHands[3]);
        expect(Deck.Difference(joinedHands,Deck.All)).toBe(0)
    });


    beforeEach(() => {
        round = new Round(0, predefinedHands);
    });

    test('bidding phase follows correct sequence', () => {
        expect(round.RoundState).toBe(0); // bidphase

        // Player 0 bids 90 Hearts
        expect(round.Bid(0, 1, 90, Card.Heart)).toBe(true);
        expect(round.CurrentBidType).toBe(1);
        expect(round.CurrentBidValue).toBe(90);
        expect(round.CurrentBidTrump).toBe(Card.Heart);

        // Others pass
        expect(round.Bid(1, 0, 0, 0)).toBe(true);
        expect(round.Bid(2, 0, 0, 0)).toBe(true);
        expect(round.Bid(3, 0, 0, 0)).toBe(true);

        expect(round.RoundState).toBe(1); // inbetweenphase
        expect(round.CurrentPlayer).toBe(0);
    });

    test('full game simulation results in valid state', () => {
        // Bidding phase
        round.Bid(0, 0, 0, 0);
        round.Bid(1, 1, 100, Card.Heart);
        round.Bid(2, 0, 0, 0);
        round.Bid(3, 0, 0, 0);
        round.Bid(0, 0, 0, 0);

        const plays: Array<Array<number>> = [
            [Card.ElevenOfClubs, Card.SevenOfClubs, Card.TenOfClubs, Card.ValetOfClubs],
            [Card.SevenOfDiamonds, Card.QueenOfDiamonds, Card.ElevenOfDiamonds, Card.NineOfDiamonds],
            [Card.EightOfClubs, Card.QueenOfClubs, Card.SevenOfHearts, Card.KingOfHearts],
            [Card.ValetOfHearts, Card.EightOfDiamonds, Card.TenOfHearts, Card.EightOfHearts],
            [Card.NineOfHearts, Card.NineOfClubs, Card.QueenOfHearts, Card.EightOfSpades],
            [Card.ElevenOfSpades, Card.KingOfClubs, Card.KingOfSpades, Card.QueenOfSpades],
            [Card.TenOfSpades, Card.TenOfDiamonds, Card.ValetOfSpades, Card.NineOfSpades],
            [Card.ElevenOfHearts, Card.KingOfDiamonds, Card.SevenOfSpades, Card.ValetOfDiamonds],
        ];
        const winners =[0,2,1,1,1,1,1,1] 

        for (let i = 0; i < plays.length; i++) {
            const play = plays[i];
            console.log(i)
            expect(round.Play(round.CurrentPlayer, play[0])).toBe(true);
            expect(round.Play(round.CurrentPlayer, play[1])).toBe(true);
            expect(round.Play(round.CurrentPlayer, play[2])).toBe(true);
            expect(round.Play(round.CurrentPlayer, play[3])).toBe(true);

            expect(round.CurrentPlayer).toBe(winners[i])
        }

        // Verify final state
        expect(Deck.Count(round.Hands[0])).toBe(0);
        expect(Deck.Count(round.Hands[1])).toBe(0);
        expect(Deck.Count(round.Hands[2])).toBe(0);
        expect(Deck.Count(round.Hands[3])).toBe(0);
        expect(round.Tricks.length).toBe(8);
    });

});