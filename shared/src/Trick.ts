import { Card, CardUtils } from "./Card";
import { Deck, DeckUtils } from "./Deck";

export default class Trick {
    private trump: number;
    private cards: Int32Array;
    private cardsIndex: number = 0;
    private winningPlayIndex: number = 0;

    public get Cards() { return this.cards; };
    public get WinningPlayIndex() { return this.winningPlayIndex; };
    public get IsDone() { return this.cardsIndex == 4; };

    constructor(trump: number) {
        this.trump = trump;
        this.cards = new Int32Array(4);
    }


    public tryPlayCard(card: number, hand: number): { value: boolean, error: string } {
        /* local functions: */
        function isWrongfullyUnderRuffing(card: number, hand: number, trump: number, winningCard: number): Boolean {
            let highestCard = DeckUtils.HighestTrumpRank(DeckUtils.Intersect(hand, trump));
            return CardUtils.Compare(highestCard, winningCard, trump) && CardUtils.Compare(winningCard, card, trump);
        }

        /* main treatment: */

        if (DeckUtils.Intersect(card, hand) == 0)  //fraud
            return { value: false, error: "fraud: invalid card" };

        if (this.cardsIndex == 0) //leading play => anything is legal
        {
            this.cards[this.cardsIndex++] = card;
            // already winning play
            return { value: true, error: "" };
        }

        if (CardUtils.Suit(this.cards[0]) == CardUtils.Suit(card) &&
            !(CardUtils.Suit(this.cards[0]) == this.trump &&
                isWrongfullyUnderRuffing(card, hand, this.trump, this.cards[this.winningPlayIndex]))
        ) // played leading suit => always legal (except if dodging an overruff)
        {
            if (CardUtils.Compare(card, this.cards[this.winningPlayIndex], this.trump))
                this.winningPlayIndex = this.cardsIndex;
            this.cards[this.cardsIndex++] = card;
            return { value: true, error: "" };
        }
        
        if (DeckUtils.Intersect(hand, CardUtils.Suit(this.cards[0])) != 0) // choose not to play leading suit => illegal
            return { value: false, error: "must paly leading suit" };

        // legaly playing a suit other than leading:

        if (DeckUtils.Intersect(hand, this.trump) == 0) // doesnt have any trump card => plays whatever
        {
            this.cards[this.cardsIndex++] = card;
            // cannot be a winning play
            return { value: true, error: "" };
        }

        if ((this.winningPlayIndex + this.cardsIndex) % 2 == 0) // current player is in the current trick's winning team => plays whatever
        {
            if (CardUtils.Compare(card, this.cards[this.winningPlayIndex], this.trump))
                this.winningPlayIndex = this.cardsIndex;
            this.cards[this.cardsIndex++] = card;
            return { value: true, error: "" };
        }

        // has no lead cards + team not winning the trick + has trump card(s) => must ruff

        if (CardUtils.Suit(card) != this.trump)// did not ruff => illegal
            return { value: false, error: "must ruff" };

        if (isWrongfullyUnderRuffing(card, hand, this.trump, this.cards[this.winningPlayIndex])) // choose to underruff => illegal
            return { value: false, error: "must overruff" };


        else {
            if (CardUtils.Compare(card, this.cards[this.winningPlayIndex], this.trump)) // may underruff or overruff
                this.winningPlayIndex = this.cardsIndex;
            this.cards[this.cardsIndex++] = card;
            return { value: true, error: "" };
        }
    }
}