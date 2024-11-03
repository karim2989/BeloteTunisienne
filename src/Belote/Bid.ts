import { Card, Suit } from "./Card";
import { PlayerId, TeamId } from "./Player";
import { Round } from "./Round";

enum BidSeverity { Pass = 0, Regulier = 160, Kaput = 250, Contre = 320, SurContre = 640, KaputGeneral = 960, SurManche = 1000 }

class Bid {
    public Issuer: PlayerId;
    public Team: TeamId;
    public Value: number;
    public Trump: Suit;
    public Severity: BidSeverity;
    constructor(issuer: PlayerId, value: number = 0, trump: Suit, severity: BidSeverity = BidSeverity.Regulier) {
        this.Issuer = issuer;
        this.Team = issuer % 2;
        this.Value = value;
        this.Trump = trump;
        this.Severity = severity;
    }

    public GreaterThan(other: Bid): boolean {
        if (this.Severity > other.Severity) return true
        else if (this.Severity < other.Severity) return false
        else return this.Value > other.Value
    }
    private isValidOnItsOwn(): boolean {
        if ([Suit.AllTrump, Suit.NoTrump].includes(this.Trump) && this.Severity < BidSeverity.Kaput) return false
        if (this.Value != 0 && (this.Value % 10 != 0 || this.Value < 90 || this.Value > 180)) return false
        if (this.Severity == BidSeverity.Kaput || this.Severity == BidSeverity.KaputGeneral)
            if(this.Trump == Suit.Unknown) return false

        return true
    }
    public IsValid(context: Round): boolean {
        if (!this.isValidOnItsOwn()) return false;
        if (this.Issuer == context.CurrentPlayer && this.Severity == BidSeverity.Pass) return true //pas
        if (this.Issuer == context.CurrentPlayer && !context.CurrentBidExist) return true//first bid
        else if (!context.CurrentBidExist) return false
        // context.CurrentBidExist assumed to exist :
        if (this.Severity > context.CurrentBid.Severity)
            return true
        else if (this.Issuer == context.CurrentPlayer && this.Severity == context.CurrentBid.Severity && this.Value > context.CurrentBid.Value)
            return true
        else return false
    }
}

export { Bid, BidSeverity }