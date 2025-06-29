import { CardUtils } from '../src/Card';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('CardUtils.ToString', () => {
    it('all cards have correct string representation', () => {
        assert.strictEqual(CardUtils.ToString(CardUtils.SevenOfHearts), '7H');
        assert.strictEqual(CardUtils.ToString(CardUtils.EightOfHearts), '8H');
        assert.strictEqual(CardUtils.ToString(CardUtils.NineOfHearts), '9H');
        assert.strictEqual(CardUtils.ToString(CardUtils.ValetOfHearts), 'VH');
        assert.strictEqual(CardUtils.ToString(CardUtils.QueenOfHearts), 'QH');
        assert.strictEqual(CardUtils.ToString(CardUtils.KingOfHearts), 'KH');
        assert.strictEqual(CardUtils.ToString(CardUtils.TenOfHearts), 'XH');
        assert.strictEqual(CardUtils.ToString(CardUtils.ElevenOfHearts), '1H');
        assert.strictEqual(CardUtils.ToString(CardUtils.SevenOfDiamonds), '7D');
        assert.strictEqual(CardUtils.ToString(CardUtils.EightOfDiamonds), '8D');
        assert.strictEqual(CardUtils.ToString(CardUtils.NineOfDiamonds), '9D');
        assert.strictEqual(CardUtils.ToString(CardUtils.ValetOfDiamonds), 'VD');
        assert.strictEqual(CardUtils.ToString(CardUtils.QueenOfDiamonds), 'QD');
        assert.strictEqual(CardUtils.ToString(CardUtils.KingOfDiamonds), 'KD');
        assert.strictEqual(CardUtils.ToString(CardUtils.TenOfDiamonds), 'XD');
        assert.strictEqual(CardUtils.ToString(CardUtils.ElevenOfDiamonds), '1D');

        assert.strictEqual(CardUtils.ToString(CardUtils.SevenOfSpades), '7S');
        assert.strictEqual(CardUtils.ToString(CardUtils.EightOfSpades), '8S');
        assert.strictEqual(CardUtils.ToString(CardUtils.NineOfSpades), '9S');
        assert.strictEqual(CardUtils.ToString(CardUtils.ValetOfSpades), 'VS');
        assert.strictEqual(CardUtils.ToString(CardUtils.QueenOfSpades), 'QS');
        assert.strictEqual(CardUtils.ToString(CardUtils.KingOfSpades), 'KS');
        assert.strictEqual(CardUtils.ToString(CardUtils.TenOfSpades), 'XS');
        assert.strictEqual(CardUtils.ToString(CardUtils.ElevenOfSpades), '1S');

        assert.strictEqual(CardUtils.ToString(CardUtils.SevenOfClubs), '7C');
        assert.strictEqual(CardUtils.ToString(CardUtils.EightOfClubs), '8C');
        assert.strictEqual(CardUtils.ToString(CardUtils.NineOfClubs), '9C');
        assert.strictEqual(CardUtils.ToString(CardUtils.ValetOfClubs), 'VC');
        assert.strictEqual(CardUtils.ToString(CardUtils.QueenOfClubs), 'QC');
        assert.strictEqual(CardUtils.ToString(CardUtils.KingOfClubs), 'KC');
        assert.strictEqual(CardUtils.ToString(CardUtils.TenOfClubs), 'XC');
        assert.strictEqual(CardUtils.ToString(CardUtils.ElevenOfClubs), '1C');
    });
});
