import { log } from "console";
import { Card, Rank, Suit, SuitCharacter } from "./Belote/Card";
import { Deck } from "./Belote/Deck";
import { Round, RoundState } from "./Belote/Round";
import { Bid, BidSeverity } from "./Belote/Bid";
import { Play } from "./Belote/Play";
import { Player } from "./Belote/Player";
import * as readline from 'node:readline/promises';

Cli()

async function Cli() {
    let r = new Round(0)
    r.Bid(new Bid(0, 90, Suit.Clubs))
    r.Bid(new Bid(2, 100, Suit.Clubs))//invalid
    r.Bid(new Bid(1, 100, Suit.Diamond))
    r.Bid(new Bid(2, 0, Suit.Unknown, BidSeverity.Pass))
    r.Bid(new Bid(3, 110, Suit.Heart))
    r.Bid(new Bid(2, 0, Suit.Heart, BidSeverity.Kaput))
    r.Bid(new Bid(3, 0, Suit.Diamond, BidSeverity.KaputGeneral))
    r.Bid(new Bid(2, 0, Suit.Heart, BidSeverity.SurManche))
    log(r.Bids)

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    while (r.State == RoundState.inbetweenPhase || r.State == RoundState.playPhase) {
        log("trick number: " + r.Tricks.length + " play number: " + r.CurrentTrick?.length + 1)
        log("current score: " + r.EarnedDecks[0].Points(r.CurrentBid.Trump) + ' vs ' + r.EarnedDecks[1].Points(r.CurrentBid.Trump))
        log("round trump: " + SuitCharacter.get(r.CurrentBid.Trump))
        log("player hands:")
        r.Players.forEach(e => { log(e.Hand.ToString()) })
        log("current trick:")
        log(r.CurrentTrick?.AsDeck()?.ToString())
        let x = await rl.question('Player ' + r.CurrentPlayer + ' : ');
        try {
            r.Play(new Play(r.CurrentPlayer, Card.FromString(x)))
        }
        catch (e) { log(e) }
    }
    log('------------')
    log('team 1 earned cards = ' + r.EarnedDecks[0].ToString())
    log('sum: ' + r.EarnedDecks[0].Points(r.CurrentBid.Trump))
    log('team 2 earned cards = ' + r.EarnedDecks[1].ToString())
    log('sum: ' + r.EarnedDecks[1].Points(r.CurrentBid.Trump))
    return
}

/*
log(new Card(Suit.Clubs,Rank.Dame).BiggerThan(new Card(Suit.Clubs,Rank.Nine)))
log(new Card(Suit.Clubs,Rank.Dame).BiggerThan(new Card(Suit.Clubs,Rank.Nine),true))
*/