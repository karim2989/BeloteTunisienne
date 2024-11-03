import { Card, Suit } from "./Card"
import { Deck } from "./Deck";
import { Player, PlayerId } from "./Player";
import { Round } from "./Round";
import { Trick } from "./Trick";

class Play {
    constructor(issuer: PlayerId, card: Card) {
        this.Issuer = issuer
        this.Card = card;
    }
    public Issuer: PlayerId;
    public Card: Card;
    public IsLegal(context: { r: Round, t: Trick }): boolean {
        let hand: Deck = context.r.Players[this.Issuer].Hand
        let trump: Suit = context.r.CurrentBid.Trump
        let lead: Suit = context.t.IsEmpty ? Suit.Unknown : context.t.LeadCard.Suit
        let winningCard: Card = context.t.IsEmpty ? Card.FromString('uu') : context.t.WinnigCard as Card;

        if (!hand.IncludesCard(this.Card)) // played an unowed card
            return false

        if (context.t.IsEmpty) // playing lead card => playes whatever
            return true

        if (lead != trump) //plain trick
        {
            if (this.Card.Suit == lead) // played lead in a plain trick
                return true
            else {//did not play lead :
                if (hand.OfSuit(lead).length > 0)// chose not to play lead => illegal
                    return false
                else {
                    // cannot play lead:
                    if (hand.OfSuit(trump).length == 0) // cannot ruff => plays whatever
                        return true
                    else {
                        // can ruff :
                        if (context.t.TrickWinner % 2 == this.Issuer % 2)// the issuer's team is winnig the trick
                            return true
                        else {
                            // must ruff (must overruff if possible)
                            if (this.Card.Suit != trump)// chose not to ruff => illegal 
                                return false;
                            //the player played a trump card :
                            if (this.Card.GreaterThanWithContext(winningCard, trump))// did ruff or overruff
                                return true
                            else {
                                //under ruffed:
                                return hand.OfSuit(trump).OfLargerRank(winningCard.Rank, true).length == 0
                            }
                        }
                    }
                }
            }
        }
        else //trump trick
        {
            if (hand.OfSuit(trump).length == 0) // cannot trump => plays whatever
                return true
            else//has trump card(s) in hand :
            {
                if (this.Card.Suit != trump) // did not trump => illegal 
                    return false
                else {
                    //played a trump card :
                    let hasHigherCard: boolean = hand.OfSuit(trump).OfLargerRank(winningCard.Rank, true).length > 0;

                    if (hasHigherCard) return this.Card.GreaterThan(winningCard, true)
                    else return true
                }
            }
        }
    }
}

export { Play }