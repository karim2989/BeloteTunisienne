import Deck from "../shared/src/Deck";

while (true) {
    
    let hands = Deck.Deal();
    
    console.log(Deck.ToString(hands[0]));
    console.log(Deck.ToString(hands[1]));
    console.log(Deck.ToString(hands[2]));
    console.log(Deck.ToString(hands[3]));
}