import { Bid, BidSeverity } from "./Bid";
import { Deck } from "./Deck";
import { Player, PlayerId } from "./Player";
import { Trick } from "./Trick";
enum RoundState { undefined = -1, BidPhase, inbetweenPhase, playPhase, done }

class Round {
    private startingPlayer: PlayerId;
    public CurrentPlayer: PlayerId;
    public State: RoundState;
    public Players: Player[];
    public Bids: Array<Bid>;
    public Tricks: Array<Trick>;
    public TeamEarnedDecks: Deck[];
    constructor(startingPlayer: PlayerId = 0) {
        this.State = RoundState.BidPhase
        this.startingPlayer = startingPlayer
        this.CurrentPlayer = startingPlayer
        //players:
        this.Players = [];
        let tempDeck = Deck.OrganizedDeck();
        tempDeck.Shuffle();
        for (let i = 0; i < 4; i++) {
            this.Players.push(new Player(i))
            this.Players[i].Hand = tempDeck.Pop8();
        }
        //arrays
        this.TeamEarnedDecks = [new Deck(), new Deck()];
        this.Bids = new Array<Bid>;
        this.Tricks = new Array<Trick>;
    }
    public get CurrentBidExist(): boolean { return this.Bids.length > 0 }
    public get CurrentBid(): Bid { return this.Bids.at(-1) as Bid }
    public set CurrentBid(a: Bid) { this.Bids.push(a); }
    private skipPlayer(): void { if (this.CurrentPlayer == 3) { this.CurrentPlayer = 0 } else this.CurrentPlayer++; }
    public Bid(bid: Bid): void {
        if (bid.IsValid(this)) {
            if (bid.Severity != BidSeverity.Pass)
                this.CurrentBid = bid
            if (bid.Severity > BidSeverity.Regulier) {
                this.State = RoundState.inbetweenPhase
            }
            else {
                this.skipPlayer()
            }
        }
    }
}

export { Round }