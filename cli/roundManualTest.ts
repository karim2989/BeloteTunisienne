import Round from "./belote/Round";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Card, CardUtils } from "./belote/Card";
import { Bid, BidType } from "./belote/Bid";

export default async function startRoundTest() {
    const rl = readline.createInterface({ input, output });
    const n = Number.parseInt(await rl.question('first player id:'));
    let r = new Round(n)

    let cmd;
    let arr;
    while (true) {
        console.log(r.toString());
        cmd = await rl.question('cmd:');
        cmd = cmd.trim().toLowerCase();
        arr = cmd.split(' ')
        if (["q", "end", "quit"].includes(arr[0])) break;

        if (arr[0] == "autobid") {
            r.Bid(new Bid(0, 1, 0xff, 90));
            r.Bid(new Bid(1,BidType.pass));
            r.Bid(new Bid(2,BidType.pass));
            r.Bid(new Bid(3,BidType.pass));
            console.log("---autobid done---");            
        }
        if (arr[0] == "bid")
            r.Bid(new Bid(Number.parseInt(arr[1]), Number.parseInt(arr[2]), Number.parseInt(arr[3]), Number.parseInt(arr[4])))
        if (arr[0] == "play")
            r.Play(r.CurrentPlayer , CardUtils.FromString(arr[1]))
    }
}