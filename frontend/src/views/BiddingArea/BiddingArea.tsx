import React, { useState } from 'react';
//import { RequestBid } from '../../Client';
import { Bid, BidType } from 'shared/src/bid';
//import { RequestBid } from '../../Client';
//import { BidType } from 'shared/src/Round';
import { CardUtils, type Card } from 'shared/src/Card';
import { DeckUtils, type Deck } from 'shared/src/Deck';
import { getInRoomIndex, RequestBid } from '../../client';

export default function BiddingArea() {
    const [biddingValue, setBiddingValue] = useState<number>(90);
    const [selectedTrump, setSelectedTrump] = useState<string>('');
    const [selectedEmoji, setSelectedEmoji] = useState<string>('');
    const [specialTrumpsEnabled, setSpecialTrumpsEnabled] = useState<boolean>(false);

    const rangeUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setBiddingValue(value);
        setSpecialTrumpsEnabled(value >= 190);
    };

    const getDisplayValue = (value: number): string => {
        if (value === 200) return 'kaput general';
        if (value === 190) return 'kaput';
        return value.toString();
    };

    const suitMap = new Map<string, Card>([
        ['coeur', CardUtils.Heart],
        ['diamond', CardUtils.Diamond],
        ['sbata', CardUtils.Club],
        ['trefle', CardUtils.Spade],
        ['sansatout', DeckUtils.None],
        ['toutatout', DeckUtils.All],
    ]);

    const createBid = (severity: 'passe' | 'annonce' | 'contre') => {

        let bid: Bid;
        switch (severity) {
            case "passe":
                bid = new Bid(getInRoomIndex(), BidType.pass);
                break;
            case "annonce":
                if (biddingValue < 190)
                    bid = new Bid(getInRoomIndex(), BidType.annonce, suitMap.get(selectedTrump), biddingValue);
                else if (biddingValue === 190)
                    bid = new Bid(getInRoomIndex(), BidType.kaput, suitMap.get(selectedTrump));
                else
                    bid = new Bid(getInRoomIndex(), BidType.kaputgeneral, suitMap.get(selectedTrump));
                break;

            default:
                throw "contreeeee oisnt implemented yety"
                break;
        }

        RequestBid(bid);
    };

    const handleTrumpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTrump(event.target.value);
    };

    const handleEmojiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedEmoji(event.target.value);
    };

    return (
        <>
            <form>
                <h4 style={{ margin: 0 }}>Anonce</h4>
                <label className="biddingFormElement" htmlFor="valuer">
                    valeur: <span className="bold">{getDisplayValue(biddingValue)}</span>
                </label>
                <br />
                <input
                    className="biddingFormElement"
                    onChange={rangeUpdate}
                    type="range"
                    step="10"
                    min="90"
                    max="200"
                    id="valuer"
                    value={biddingValue}
                />
                <p style={{ margin: 0 }}>atout:</p>
                <label htmlFor="coeur">
                    <input type="radio" id="coeur" name="atout" value="coeur" onChange={handleTrumpChange} />
                    <img className="radioimage" src="assets/black_red/576_384.png" alt="coeur" />
                </label>
                <label htmlFor="diamond">
                    <input type="radio" id="diamond" name="atout" value="diamond" onChange={handleTrumpChange} />
                    <img className="radioimage" src="assets/black_red/704_384.png" alt="diamond" />
                </label>
                <label htmlFor="sbata">
                    <input type="radio" id="sbata" name="atout" value="sbata" onChange={handleTrumpChange} />
                    <img className="radioimage" src="assets/black_white/512_384.png" alt="sbata" />
                </label>
                <label htmlFor="trefle">
                    <input type="radio" id="trefle" name="atout" value="trefle" onChange={handleTrumpChange} />
                    <img className="radioimage" src="assets/black_white/640_384.png" alt="trefle" />
                </label>
                <label htmlFor="sansatout">
                    <input type="radio" id="sansatout" name="atout" value="sansatout" disabled={!specialTrumpsEnabled} onChange={handleTrumpChange} />
                    <img className="radioimage" src="assets/0_384.png" alt="sansatout" />
                </label>
                <label htmlFor="toutatout">
                    <input type="radio" id="toutatout" name="atout" value="toutatout" disabled={!specialTrumpsEnabled} onChange={handleTrumpChange} />
                    <img className="radioimage" src="assets/256_384.png" alt="toutatout" />
                </label>
            </form>
            <form>
                <label htmlFor="😆">
                    <input type="radio" id="😆" name="grimace" value="😆" onChange={handleEmojiChange} />
                    <span className="radiospan">😆</span>
                </label>
                <label htmlFor="😐">
                    <input type="radio" id="😐" name="grimace" value="😐" onChange={handleEmojiChange} />
                    <span className="radiospan">😐</span>
                </label>
                <label htmlFor="🤔">
                    <input type="radio" id="🤔" name="grimace" value="🤔" onChange={handleEmojiChange} />
                    <span className="radiospan">🤔</span>
                </label>
                <br />
                <input type="button" onClick={() => createBid('passe')} value="passe" />
                <input type="button" onClick={() => createBid('annonce')} value="annonce" />
                <input type="button" onClick={() => createBid('contre')} value="contre/surcontre" />
            </form >
        </>
    );
}