import Deck from "./shared/src/Deck";

let hands = Deck.Deal();

console.log(Deck.Count(hands[0]));
console.log(Deck.Count(hands[1]));
console.log(Deck.Count(hands[2]));
console.log(Deck.Count(hands[3]));