import { log } from "console";
import { Card, Rank, Suit } from "./Belote/Card";
import { Deck } from "./Belote/Deck";
import { Round } from "./Belote/Round";
import { Bid, BidSeverity } from "./Belote/Bid";

let r = new Round(0)
r.Players.forEach(e => {log(e.Hand.ToString())})
r.Bid(new Bid(0,90,Suit.Clubs))
r.Bid(new Bid(2,100,Suit.Clubs))//invalid
r.Bid(new Bid(1,100,Suit.Diamond))
r.Bid(new Bid(2,0,Suit.Unknown,BidSeverity.Pass))
r.Bid(new Bid(3,110,Suit.Heart))
r.Bid(new Bid(2,0,Suit.Heart,BidSeverity.Kaput))
r.Bid(new Bid(3,0,Suit.Diamond,BidSeverity.KaputGeneral))
r.Bid(new Bid(2,0,Suit.Heart,BidSeverity.SurManche))
log(r.Bids)
log(r.State)
log(r.State)
/*
log(new Card(Suit.Clubs,Rank.Dame).BiggerThan(new Card(Suit.Clubs,Rank.Nine)))
log(new Card(Suit.Clubs,Rank.Dame).BiggerThan(new Card(Suit.Clubs,Rank.Nine),true))
*/