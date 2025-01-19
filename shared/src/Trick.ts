import Card from "./Card";
import Deck from "./Deck";

export default class Trick {
    private trump: number;
    private cards: Int32Array;// todo: replace with a number
    private cardsIndex: number = 0;
    private winningPlayIndex: number = 0;
    public get WinningPlayIndex() { return this.winningPlayIndex; };

    constructor(trump: number) {
        this.trump = trump;
        this.cards = new Int32Array(4);
    }


    public tryPlayCard(card: number, hand: number): boolean {
        /* local functions: */
        function isWrongfullyUnderRuffing(card: number, hand: number, trump: number, winningCard: number): Boolean {
            let highestCard = Deck.HighestTrumpRank(Deck.Intersect(hand, trump));
            return Card.IsHigher(highestCard, winningCard, trump) && Card.IsHigher(winningCard, card, trump);
        }

        /* main treatment: */

        if (Deck.Intersect(card, hand) == 0)  //fraud
            return false;

        if (this.cardsIndex == 0) //leading play => anything is legal
        {
            this.cards[this.cardsIndex++] = card;
            // already winning play
            return true;
        }

        if (Card.Suit(this.cards[0]) == Card.Suit(card) &&
            !(Card.Suit(this.cards[0]) == this.trump &&
                isWrongfullyUnderRuffing(card, hand, this.trump, this.cards[this.winningPlayIndex]))
        ) // played leading suit => always legal (except if dodging an overruff)
        {
            if (Card.IsHigher(card, this.cards[this.winningPlayIndex], this.trump))
                this.winningPlayIndex = this.cardsIndex;
            this.cards[this.cardsIndex++] = card;
            return true;
        }

        if (Deck.Intersect(hand, Card.Suit(this.cards[0])) != 0) // choose not to play leading suit => illegal
            return false;

        // legaly playing a suit other than leading:

        if (Deck.Intersect(hand, this.trump) == 0) // doesnt have any trump card => plays whatever
        {
            this.cards[this.cardsIndex++] = card;
            // cannot be a winning play
            return true;
        }

        if ((this.winningPlayIndex + this.cardsIndex) % 2 == 0) // current player is in the current trick's winning team => plays whatever
        {
            if (Card.IsHigher(card, this.cards[this.winningPlayIndex], this.trump))
                this.winningPlayIndex = this.cardsIndex;
            this.cards[this.cardsIndex++] = card;
            return true;
        }

        // has no lead cards + team not winning the trick + has trump card(s) => must ruff

        if (Card.Suit(card) != Card.Suit(this.trump))// did not ruff => illegal
            return false;

        if (isWrongfullyUnderRuffing(card, hand, this.trump, this.cards[this.winningPlayIndex])) // choose to underruff => illegal
            return false;


        else {
            if (Card.IsHigher(card, this.cards[this.winningPlayIndex], this.trump)) // may underruff or overruff
                this.winningPlayIndex = this.cardsIndex;
            this.cards[this.cardsIndex++] = card;
            return true;
        }
    }
}