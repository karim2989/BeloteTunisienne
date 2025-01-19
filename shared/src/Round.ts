import Deck from "./Deck";
import Trick from "./Trick";

enum BidType { passe = 0, annonce = 1, contre = 2, surcontre = 3, kaput = 4, kaputgeneral = 5, surmanche = 6 }
enum BidSeverity { syncronise, contre, surcontre }

const severityByType = new Int32Array([
    BidSeverity.syncronise,
    BidSeverity.syncronise,
    BidSeverity.contre,
    BidSeverity.surcontre,
    BidSeverity.syncronise,
    BidSeverity.syncronise,
    BidSeverity.syncronise
]);

enum RoundState { bidphase, inbetweenphase, playphase, done }

export default class Round {
    private currentPlayer: number;
    private firstplayer: number;
    private roundState = RoundState.bidphase;

    private currentBidType: BidType = 0;
    private currentBidTrump: number = 0;
    private currentBidValue: BidType = 0;
    private currentBidPlayer: number = 0;

    private hands: Int32Array;
    private tricks: Array<Trick> = [];

    constructor(firstplayer: number) {
        this.firstplayer = firstplayer;
        this.currentPlayer = firstplayer;
        this.hands = Deck.Deal();
    }

    public Bid(player: number, bidType: BidType, bidValue: number, bidTrump: number): void {

        if (
            player < 0 || player > 3 ||
            bidType as number < BidType.passe || bidType as number > BidType.surmanche ||
            bidValue % 10 > 0 || Deck.Count(bidTrump) != 8
        ) // bonkers bid 
            return;

        if (severityByType[bidType] == severityByType[this.currentBidType] + 1) {
            // more severe bid :
            if(this.currentBidType == 0)
                return;
            this.currentBidPlayer = player;
            this.currentBidValue = bidValue;
            this.currentBidType = bidType;
            this.currentBidTrump = bidTrump;
            this.currentPlayer = ++player % 4;
            this.roundState = RoundState.inbetweenphase;
            this.currentPlayer = this.firstplayer;
            this.tricks.push(new Trick(this.currentBidTrump));
            return;
        }
        else if (player == this.currentPlayer && this.roundState == RoundState.bidphase) {
            if (bidType > this.currentBidType ||
                (bidType == this.currentBidType && bidValue > this.currentBidValue)) {
                // higher value bid :
                this.currentBidPlayer = player;
                this.currentBidValue = bidValue;
                this.currentBidType = bidType;
                this.currentBidTrump = bidTrump;
                this.tricks.push(new Trick(this.currentBidTrump));
            }
            
            this.currentPlayer = ++player % 4;
            if (this.currentBidPlayer == player) {
                this.roundState = RoundState.inbetweenphase;
                this.currentPlayer = this.firstplayer
            }
        }
    }

    public Play(player: number, card: number) {
        if (player != this.currentPlayer)
            return false;

        if (this.tricks.at(-1)?.tryPlayCard(card, this.hands[player])) {
            this.currentPlayer = ++player % 4;
            if (this.currentPlayer = this.firstplayer) {// trick done:
                ///@ts-expect-error
                this.firstplayer = (this.firstplayer + this.tricks.at(-1)?.WinningPlayIndex) % 4;
                this.currentPlayer = this.firstplayer;
                this.tricks.push(new Trick(this.currentBidTrump));
            }
        }

    }
    public Dump(): string {
        return "current player: " + this.currentPlayer + " \n" +
            "round state :" + this.roundState + " \n" +
            "bid information:" + "\n" +
            this.currentBidType + " " +
            this.currentBidTrump + " " +
            this.currentBidValue + " " +
            this.currentBidPlayer + "\n" +
            "hands" + "\n" +
            Deck.ToString(this.hands[0]) + "\n" +
            Deck.ToString(this.hands[1]) + "\n" +
            Deck.ToString(this.hands[2]) + "\n" +
            Deck.ToString(this.hands[3]) + "\n"
    }
}