import { Bid, BidType } from "./Bid";
import { Card, CardUtils } from "./Card";
import { Deck, DeckUtils } from "./Deck";
import Trick from "./Trick";

export enum RoundState { bidphase, inbetweenphase, playphase, done }

export default class Round {
    private firstplayer: number;
    private currentPlayer: number;
    private hands: Int32Array;

    private roundState = RoundState.bidphase;
    public currentBid: Bid = new Bid(0, BidType.pass, NaN, NaN); // Default bid is a pass with no trump
    private readonly biddenSuitsByTeam: Deck[] = [DeckUtils.None, DeckUtils.None];

    private tricks: Array<Trick> = [];
    private scores: Int32Array = new Int32Array(2);

    public get FirstPlayer(): number { return this.firstplayer }
    public get CurrentPlayer(): number { return this.currentPlayer }
    public get RoundState(): RoundState { return this.roundState; }
    public get CurrentBid(): Bid { return this.currentBid; }
    public get Hands(): Int32Array { return this.hands; }
    public get Tricks(): Array<Trick> { return this.tricks; }
    public get Scores(): Int32Array { return this.scores; }

    constructor(firstplayer: number, hands: Array<string> = []) {
        this.firstplayer = firstplayer;
        this.currentPlayer = firstplayer;
        if (hands.length != 4)
            this.hands = DeckUtils.Deal();
        else {
            this.hands = new Int32Array(4);
            for (let i = 0; i < 4; i++)
                this.hands[i] = DeckUtils.FromString(hands[i])
        }
    }

    public Bid(bid: Bid): boolean {

        ///#region check if player is allowed to jump turn with a more severe bid
        if (bid.IsSevere) {
            if (this.roundState != RoundState.bidphase && this.roundState != RoundState.inbetweenphase)
                return false;
            if (this.currentBid.Type == BidType.pass)
                return false;

            if (this.currentBid.Contree == false && bid.Type == BidType.contre) {
                this.currentBid.Contree = true;
                this.roundState = RoundState.inbetweenphase;
                this.currentPlayer = this.firstplayer;
                return true;
            }
            if (this.currentBid.Contree == true && bid.Type == BidType.surcontre) {
                this.currentBid.Surcontree = true;
                this.roundState = RoundState.playphase;
                this.currentPlayer = this.firstplayer;
                return true;
            }

            return false;
        }
        /////#endregion

        ///#region checks the player is in their turn
        else if (bid.Player == this.currentPlayer && this.roundState == RoundState.bidphase) {
            if (bid.Type == BidType.pass) {
                this.currentPlayer = ++this.currentPlayer % 4;
                if (this.currentPlayer == this.currentBid.Player) {
                    this.roundState = RoundState.inbetweenphase;
                    this.currentPlayer = this.firstplayer
                }
                return true;
            }
            if (bid.Type == BidType.kaput || (bid.Type == BidType.kaputgeneral && bid.Player != this.firstplayer)) {
                this.currentBid = bid;
                this.currentPlayer = this.firstplayer
                this.roundState = RoundState.playphase;
            }
            if ((bid.Type == BidType.annonce && this.currentBid.Type == BidType.pass) ||
                (bid.Type == BidType.annonce && this.currentBid.Type == BidType.annonce && bid.Value > this.currentBid.Value)) {
                // higher value bid :
                let lastbid = this.currentBid;
                this.currentBid = bid;
                // surmanche check:
                this.biddenSuitsByTeam[bid.Player % 2] |= bid.Trump;
                if (this.biddenSuitsByTeam[(bid.Player + 1) % 2] == bid.Trump) {
                    if (bid.Player == this.firstplayer)
                        this.currentBid = lastbid;
                    else {
                        this.currentBid.Surmanchee = true;
                        this.roundState = RoundState.playphase;
                    }
                }
            }

            this.currentPlayer = ++this.currentPlayer % 4;
            return true
        }
        /////#endregion
        // low bid + out of turn => does nothing
        else
            return false;
    }

    public Play(player: number, card: Card): boolean {
        if (player != this.currentPlayer)
            return false;

        if (this.roundState == RoundState.inbetweenphase)
            this.roundState = RoundState.playphase

        if (this.tricks.length == 0) this.tricks.push(new Trick(this.currentBid.Trump));

        if (this.tricks.at(-1)?.tryPlayCard(card, this.hands[player]).value) {
            if (
                (this.currentBid.Type == BidType.kaput && (this.tricks.at(-1)?.WinningPlayIndex as number % 2 != this.currentBid.Player % 2)) ||
                (this.currentBid.Type == BidType.kaputgeneral && (this.tricks.at(-1)?.WinningPlayIndex as number != this.currentBid.Player))
            ) {
                let roundPoints = this.currentBid.Type == BidType.kaput ? 500 : 1000;
                this.roundState = RoundState.done;
                this.scores[(this.currentBid.Player + 1) % 2] = roundPoints;
                this.scores[this.currentBid.Player % 2] = 0;
            }
            this.hands[player] = this.hands[player] ^ card;
            this.currentPlayer = ++player % 4;
            if (this.tricks.at(-1)?.IsDone) {// trick done:
                ///@ts-expect-error
                this.firstplayer = (this.firstplayer + this.tricks.at(-1)?.WinningPlayIndex) % 4;
                this.currentPlayer = this.firstplayer;
                if (this.tricks.length == 8) {
                    this.roundState = RoundState.done
                    this.tricks.forEach(trick => {
                        trick.Cards.forEach(c => {
                            this.scores[(trick.WinningPlayIndex as number) % 2] += CardUtils.Suit(c) == this.currentBid.Trump ? CardUtils.TrumpValue(c) : CardUtils.PlainValue(c);
                        });
                    });
                    switch (this.currentBid.Type) {
                        case BidType.kaput:
                            this.scores[(this.currentBid.Player + 1) % 2] += 0;
                            this.scores[this.currentBid.Player % 2] = 500;
                            break;
                        case BidType.kaputgeneral:
                            this.scores[(this.currentBid.Player + 1) % 2] += 0;
                            this.scores[this.currentBid.Player % 2] = 1000;
                            break;
                        case BidType.annonce:
                            if (this.currentBid.Surmanchee || this.currentBid.Contree || this.currentBid.Surcontree) {
                                let roundPoints = this.currentBid.Surmanchee ? 1000
                                    : (this.currentBid.Surcontree ? 640 : 320);
                                if (this.scores[this.currentBid.Player % 2] >= this.currentBid.Value) { // rbi7t surmanche
                                    this.scores[(this.currentBid.Player + 1) % 2] = 0;
                                    this.scores[this.currentBid.Player % 2] = roundPoints;
                                }
                                else {
                                    this.scores[(this.currentBid.Player + 1) % 2] = roundPoints;
                                    this.scores[this.currentBid.Player % 2] = 0;
                                }
                            }
                            else // annonce normale
                            {
                                if (this.scores[this.currentBid.Player % 2] >= this.currentBid.Value) { // rbi7t
                                    this.scores[(this.currentBid.Player + 1) % 2] %= 10;
                                    this.scores[this.currentBid.Player % 2] %= 10;
                                }
                                else {
                                    this.scores[(this.currentBid.Player + 1) % 2] = 160;
                                    this.scores[this.currentBid.Player % 2] = 0;
                                }
                            }
                            break;
                    }
                }
                else // round isnt done yet
                    this.tricks.push(new Trick(this.currentBid.Trump));
            }
            return true
        }
        return false
    }

    public toString(): string {
        const states = ['bidphase', 'inbetweenphase', 'playphase', 'done'];
        const bidTypes = ['pass', 'annonce', 'contre', 'surcontre', 'kaput', 'kaputgeneral', 'surmanche'];

        return [
            `Current player: ${this.currentPlayer}`,
            `Round state: ${states[this.roundState]}`,
            'Bid information:',
            `Type: ${bidTypes[this.currentBid?.Type ?? 0]}`,
            `Trump: ${this.currentBid?.Trump ?? ''}`,
            `Value: ${this.currentBid?.Value ?? ''}`,
            `Player: ${this.currentBid?.Player ?? ''}`,
            'Hands:',
            ...Array.from({ length: 4 }, (_, i) => `Player ${i}: ${DeckUtils.ToString(this.hands[i])}`)
        ].join('\n');
    }
}