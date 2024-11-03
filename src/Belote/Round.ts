import { Bid, BidSeverity } from "./Bid";
import { Card } from "./Card";
import { Deck } from "./Deck";
import { Play } from "./Play";
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
    public EarnedDecks: Array<Deck>;
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
        this.EarnedDecks = [new Deck(), new Deck()];
        this.Bids = new Array<Bid>;
        this.Tricks = new Array<Trick>;
    }
    public get CurrentBidExist(): boolean { return this.Bids.length > 0 }
    public get CurrentBid(): Bid { return this.Bids.at(-1) as Bid }
    public set CurrentBid(a: Bid) { this.Bids.push(a); }
    public get CurrentTrick(): Trick { return this.Tricks.at(-1) as Trick }
    public set CurrentTrick(t: Trick) { this.Tricks.push(t); }
    private skipPlayer(): void { if (this.CurrentPlayer == 3) { this.CurrentPlayer = 0 } else this.CurrentPlayer++; }
    public Bid(bid: Bid): void {
        if (bid.IsValid(this)) {
            if (bid.Severity != BidSeverity.Pass)
                this.CurrentBid = bid
            if (bid.Severity > BidSeverity.Regulier) {
                this.State = RoundState.inbetweenPhase
                this.CurrentPlayer = this.startingPlayer
            }
            else {
                this.skipPlayer()
            }
        }
    }
    public Play(play: Play): void {
        if(this.Tricks.length == 0) this.CurrentTrick = new Trick();
        if (this.State == RoundState.playPhase || this.State == RoundState.inbetweenPhase)
            if (play.IsLegal({ r: this, t: this.CurrentTrick })) {
                if (this.State == RoundState.inbetweenPhase)
                    this.State = RoundState.playPhase
                if (this.CurrentTrick.IsEmpty || play.Card.GreaterThanWithContext(this.CurrentTrick.WinnigCard as Card, this.CurrentBid.Trump))
                    this.CurrentTrick.WinningPlay = play
                this.CurrentTrick.push(play)
                this.skipPlayer()
                this.Players[play.Issuer].Hand.RemoveCard(play.Card)

                if (this.CurrentTrick.length == 4) {
                    this.EarnedDecks[this.CurrentTrick.WinningPlay?.Issuer as number % 2].Add(this.CurrentTrick.AsDeck())
                    this.CurrentPlayer = this.CurrentTrick.WinningPlay?.Issuer as number
                    if (this.Tricks.length == 8)
                        this.State = RoundState.done
                    else
                        this.CurrentTrick = new Trick();
                }
            }
    }
}

export { Round, RoundState }