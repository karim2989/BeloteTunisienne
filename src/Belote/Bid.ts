import { Suit } from "./Card";
import { PlayerId, TeamId } from "./Player";
import { Round } from "./Round";

enum BidSeverity { Regulier = 160, Kaput = 250, Contre = 320, SurContre = 640, KaputGeneral = 960, SurManche = 1000 }

class Bid {
    public Issuer: PlayerId;
    public Team: TeamId;
    public Value: number;
    public Trump: Suit;
    public Severity: BidSeverity;
    constructor(issuer: PlayerId, team: TeamId, value: number, trump: Suit, severity: BidSeverity) {
        this.Issuer = issuer;
        this.Team = team;
        this.Value = value;
        this.Trump = trump;
        this.Severity = severity;
    }

    public GreaterThan(other: Bid): boolean {
        if (this.Severity > other.Severity) return true
        else if (this.Severity < other.Severity) return false
        else return this.Value > other.Value
    }

    public IsValid(context: Round) {
        blablabala
    }
}

export { Bid, BidSeverity }