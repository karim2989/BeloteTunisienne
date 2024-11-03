import { log, trace } from "console";
import { Deck } from "./Deck";

type PlayerId = number
type TeamId = number

class Player {
    constructor(id: PlayerId) {
        this.Id = id
    }
    public Id: PlayerId = -1;
    public Hand: Deck = new Deck();
    public get Team(): TeamId { return this.Id % 2 }

    public ToString(): string {
        let output = "[";
        output += "Player " + this.Id + ", "
        output += "Team " + this.Team + ", "
        output += this.Hand.ToString()
        return output + "]"
    }
}

export { Player, PlayerId, TeamId }