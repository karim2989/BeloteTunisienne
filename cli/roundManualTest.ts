import Round from "../shared/src/Round";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import Card from "../shared/src/Card";

export default async function startRoundTest() {
    const rl = readline.createInterface({ input, output });
    const n = Number.parseInt(await rl.question('first player id:'));
    let r = new Round(n)

    let cmd;
    let arr;
    while (true) {
        console.log(r.Dump());
        cmd = await rl.question('cmd:');
        cmd = cmd.trim().toLowerCase();
        arr = cmd.split(' ') 
        if(["q","end","quit"].includes(arr[0])) break;

        if(arr[0] == "autobid"){
            r.Bid(0,1,90,0xff);
            r.Bid(1,0,0,0);
            r.Bid(2,0,0,0);
            r.Bid(3,0,0,0);
        }
        if(arr[0] == "bid")
            r.Bid(Number.parseInt(arr[1]),Number.parseInt(arr[2]),Number.parseInt(arr[3]),Number.parseInt(arr[4]))
        if(arr[0] == "play")
            r.Play(Number.parseInt(arr[1]),Card.FromString(arr[2]))
    }
}