import BiddingArea from "./components/BiddingArea";
import BidStatus from "./components/BidStatus";
import Chatbox from "./components/Chatbox";
import Hand from "./components/Hand";
import ScoreBoard from "./components/ScoreBoard";
import Table from "./components/Table";

export default function Game() {
    return <>
        <ScoreBoard />
        <Chatbox />
        <BidStatus />
        <Table />
        <Hand />
        <BiddingArea />
    </>
}  