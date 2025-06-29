import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CardUtils } from '../src/Card.js';

describe('FromString tests', () => {
    it('should handle all ranks with hearts', () => {
        assert.strictEqual(CardUtils.FromString('7h'), CardUtils.SevenOfHearts);
        assert.strictEqual(CardUtils.FromString('8h'), CardUtils.EightOfHearts);
        assert.strictEqual(CardUtils.FromString('9h'), CardUtils.NineOfHearts);
        assert.strictEqual(CardUtils.FromString('vh'), CardUtils.ValetOfHearts);
        assert.strictEqual(CardUtils.FromString('qh'), CardUtils.QueenOfHearts);
        assert.strictEqual(CardUtils.FromString('kh'), CardUtils.KingOfHearts);
        assert.strictEqual(CardUtils.FromString('xh'), CardUtils.TenOfHearts);
        assert.strictEqual(CardUtils.FromString('1h'), CardUtils.ElevenOfHearts);
    });

    it('should handle combinations of uppercase and lowercase', () => {
        assert.strictEqual(CardUtils.FromString('Vh'), CardUtils.ValetOfHearts);
        assert.strictEqual(CardUtils.FromString('vH'), CardUtils.ValetOfHearts);
        assert.strictEqual(CardUtils.FromString('VH'), CardUtils.ValetOfHearts);
        assert.strictEqual(CardUtils.FromString('Xs'), CardUtils.TenOfSpades);
        assert.strictEqual(CardUtils.FromString('xS'), CardUtils.TenOfSpades);
        assert.strictEqual(CardUtils.FromString('XS'), CardUtils.TenOfSpades);
    });

    it('should throw error for invalid combinations', () => {
        assert.throws(() => CardUtils.FromString('2h'));
        assert.throws(() => CardUtils.FromString('6d'));
        assert.throws(() => CardUtils.FromString('th'));
        assert.throws(() => CardUtils.FromString('js'));
        assert.throws(() => CardUtils.FromString('ph'));
        assert.throws(() => CardUtils.FromString(' h'));
        assert.throws(() => CardUtils.FromString('h '));
        assert.throws(() => CardUtils.FromString(' 7h'));
    });

    it('should handle all ranks with diamonds', () => {
        assert.strictEqual(CardUtils.FromString('7d'), CardUtils.SevenOfDiamonds);
        assert.strictEqual(CardUtils.FromString('8d'), CardUtils.EightOfDiamonds);
        assert.strictEqual(CardUtils.FromString('9d'), CardUtils.NineOfDiamonds);
        assert.strictEqual(CardUtils.FromString('vd'), CardUtils.ValetOfDiamonds);
        assert.strictEqual(CardUtils.FromString('qd'), CardUtils.QueenOfDiamonds);
        assert.strictEqual(CardUtils.FromString('kd'), CardUtils.KingOfDiamonds);
        assert.strictEqual(CardUtils.FromString('xd'), CardUtils.TenOfDiamonds);
        assert.strictEqual(CardUtils.FromString('1d'), CardUtils.ElevenOfDiamonds);
    });

    it('should handle all ranks with clubs', () => {
        assert.strictEqual(CardUtils.FromString('7c'), CardUtils.SevenOfClubs);
        assert.strictEqual(CardUtils.FromString('8c'), CardUtils.EightOfClubs);
        assert.strictEqual(CardUtils.FromString('9c'), CardUtils.NineOfClubs);
        assert.strictEqual(CardUtils.FromString('vc'), CardUtils.ValetOfClubs);
        assert.strictEqual(CardUtils.FromString('qc'), CardUtils.QueenOfClubs);
        assert.strictEqual(CardUtils.FromString('kc'), CardUtils.KingOfClubs);
        assert.strictEqual(CardUtils.FromString('xc'), CardUtils.TenOfClubs);
        assert.strictEqual(CardUtils.FromString('1c'), CardUtils.ElevenOfClubs);
    });
});

describe('FromString', () => {
    it('should correctly parse valid card strings', () => {
        assert.strictEqual(CardUtils.FromString('7h'), CardUtils.SevenOfHearts);
        assert.strictEqual(CardUtils.FromString('8d'), CardUtils.EightOfDiamonds);
        assert.strictEqual(CardUtils.FromString('9s'), CardUtils.NineOfSpades);
        assert.strictEqual(CardUtils.FromString('vc'), CardUtils.ValetOfClubs);
        assert.strictEqual(CardUtils.FromString('qh'), CardUtils.QueenOfHearts);
        assert.strictEqual(CardUtils.FromString('kd'), CardUtils.KingOfDiamonds);
        assert.strictEqual(CardUtils.FromString('xs'), CardUtils.TenOfSpades);
        assert.strictEqual(CardUtils.FromString('1c'), CardUtils.ElevenOfClubs);
    });

    it('should be case insensitive', () => {
        assert.strictEqual(CardUtils.FromString('7H'), CardUtils.SevenOfHearts);
        assert.strictEqual(CardUtils.FromString('Vc'), CardUtils.ValetOfClubs);
        assert.strictEqual(CardUtils.FromString('xS'), CardUtils.TenOfSpades);
    });

    it('should throw error for invalid input', () => {
        assert.throws(() => CardUtils.FromString(''));
        assert.throws(() => CardUtils.FromString('7'));
        assert.throws(() => CardUtils.FromString('77h'));
        assert.throws(() => CardUtils.FromString('7x'));
        assert.throws(() => CardUtils.FromString('ah'));
    });
});