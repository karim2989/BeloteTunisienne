import Card from "./Card";
import Deck from "./Deck";
import Trick from "./Trick";

enum BidType { pass = 0, annonce = 1, contre = 2, surcontre = 3, kaput = 4, kaputgeneral = 5, surmanche = 6 }
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

    public get CurrentPlayer(): number { return this.currentPlayer }
    public get RoundState(): RoundState { return this.roundState; }
    public get CurrentBidType(): BidType { return this.currentBidType; }
    public get CurrentBidTrump(): number { return this.currentBidTrump; }
    public get CurrentBidValue(): BidType { return this.currentBidValue; }
    public get CurrentBidPlayer(): number { return this.currentBidPlayer; }
    public get Hands(): Int32Array { return this.hands; }
    public get Tricks(): Array<Trick> { return this.tricks; }

    constructor(firstplayer: number) {
        this.firstplayer = firstplayer;
        this.currentPlayer = firstplayer;
        this.hands = Deck.Deal();
    }

    public Bid(player: number, bidType: BidType, bidValue: number, bidTrump: number): boolean {

        ///#region checks if the bid itself is valid without context
        let isInvalidPlayer = player < 0 || player > 3
        let isInvalidType = bidType as number < BidType.pass || bidType as number > BidType.surmanche
        let isInvalidValue = bidType == BidType.annonce && (bidValue < 90 || bidValue > 180 || bidValue % 10 > 0)
        let isInvalidTrump = bidTrump % Card.Heart != 0
        if (isInvalidPlayer || isInvalidType || isInvalidValue || isInvalidTrump) // bonkers bid 
            return false;

        /////#endregion

        ///#region check if player is allowed to jump turn with a more severe bid
        if (severityByType[bidType] == severityByType[this.currentBidType] + 1) {
            if (this.currentBidType == BidType.pass)
                return false;
            this.currentBidPlayer = player;
            this.currentBidValue = bidValue;
            this.currentBidType = bidType;
            this.currentBidTrump = bidTrump;
            this.currentPlayer = ++player % 4;
            this.roundState = RoundState.inbetweenphase;
            this.currentPlayer = this.firstplayer;
            this.tricks.push(new Trick(this.currentBidTrump));
            return true;
        }
        /////#endregion
        ///#region checks the player is in their turn
        else if (player == this.currentPlayer && this.roundState == RoundState.bidphase) {
            // the player is in his turn:
            if ((bidType == this.currentBidType + 1) ||
                (bidType == this.currentBidType && bidValue > this.currentBidValue)) {
                // higher value bid :
                this.currentBidPlayer = player;
                this.currentBidValue = bidValue;
                this.currentBidType = bidType;
                this.currentBidTrump = bidTrump;
                this.tricks.push(new Trick(this.currentBidTrump));
            }

            this.currentPlayer = ++player % 4;
            if (this.currentPlayer == this.currentBidPlayer) {
                this.roundState = RoundState.inbetweenphase;
                this.currentPlayer = this.firstplayer
            }
            return true
        }
        /////#endregion
        // low bid + out of turn => does nothing
        else
            return false
    }

    public Play(player: number, card: number): boolean {
        if (player != this.currentPlayer)
            return false;

        if (this.tricks.at(-1)?.tryPlayCard(card, this.hands[player])) {
            this.currentPlayer = ++player % 4;
            if (this.currentPlayer == this.firstplayer) {// trick done:
                ///@ts-expect-error
                this.firstplayer = (this.firstplayer + this.tricks.at(-1)?.WinningPlayIndex) % 4;
                this.currentPlayer = this.firstplayer;
                this.tricks.push(new Trick(this.currentBidTrump));
            }
            return true
        }
        return false
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