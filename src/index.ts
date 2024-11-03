import { log } from "console";
import { Card, Rank, Suit } from "./Belote/Card";
import { Deck } from "./Belote/Deck";

log(Deck.FromString("7♠ 8♠ 9♠ v♠ d♠ r♠ x♠ 1♠ 7♣ 8♣ 9♣ v♣").OfLargerRank(Rank.Nine).ToString())
log(Deck.FromString("7♠ 8♠ 9♠ v♠ d♠ r♠ x♠ 1♠ 7♣ 8♣ 9♣ v♣").OfLargerRank(Rank.Nine,true).ToString())

/*
log(new Card(Suit.Clubs,Rank.Dame).BiggerThan(new Card(Suit.Clubs,Rank.Nine)))
log(new Card(Suit.Clubs,Rank.Dame).BiggerThan(new Card(Suit.Clubs,Rank.Nine),true))
*/