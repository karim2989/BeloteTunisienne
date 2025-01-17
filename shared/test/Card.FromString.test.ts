import Card from '../src/Card';

describe('FromString tests', () => {
    it('should handle all ranks with hearts', () => {
        expect(Card.FromString('7h')).toBe(Card.SevenOfHearts);
        expect(Card.FromString('8h')).toBe(Card.EightOfHearts);
        expect(Card.FromString('9h')).toBe(Card.NineOfHearts);
        expect(Card.FromString('vh')).toBe(Card.ValetOfHearts);
        expect(Card.FromString('qh')).toBe(Card.QueenOfHearts);
        expect(Card.FromString('kh')).toBe(Card.KingOfHearts);
        expect(Card.FromString('xh')).toBe(Card.TenOfHearts);
        expect(Card.FromString('1h')).toBe(Card.ElevenOfHearts);
    });

    it('should handle combinations of uppercase and lowercase', () => {
        expect(Card.FromString('Vh')).toBe(Card.ValetOfHearts);
        expect(Card.FromString('vH')).toBe(Card.ValetOfHearts);
        expect(Card.FromString('VH')).toBe(Card.ValetOfHearts);
        expect(Card.FromString('Xs')).toBe(Card.TenOfSpades);
        expect(Card.FromString('xS')).toBe(Card.TenOfSpades);
        expect(Card.FromString('XS')).toBe(Card.TenOfSpades);
    });

    it('should throw error for invalid combinations', () => {
        expect(() => Card.FromString('2h')).toThrow();
        expect(() => Card.FromString('6d')).toThrow();
        expect(() => Card.FromString('th')).toThrow();
        expect(() => Card.FromString('js')).toThrow();
        expect(() => Card.FromString('ph')).toThrow();
        expect(() => Card.FromString(' h')).toThrow();
        expect(() => Card.FromString('h ')).toThrow();
        expect(() => Card.FromString(' 7h')).toThrow();
    });
    it('should handle all ranks with diamonds', () => {
        expect(Card.FromString('7d')).toBe(Card.SevenOfDiamonds);
        expect(Card.FromString('8d')).toBe(Card.EightOfDiamonds);
        expect(Card.FromString('9d')).toBe(Card.NineOfDiamonds);
        expect(Card.FromString('vd')).toBe(Card.ValetOfDiamonds);
        expect(Card.FromString('qd')).toBe(Card.QueenOfDiamonds);
        expect(Card.FromString('kd')).toBe(Card.KingOfDiamonds);
        expect(Card.FromString('xd')).toBe(Card.TenOfDiamonds);
        expect(Card.FromString('1d')).toBe(Card.ElevenOfDiamonds);
    });

    it('should handle all ranks with clubs', () => {
        expect(Card.FromString('7c')).toBe(Card.SevenOfClubs);
        expect(Card.FromString('8c')).toBe(Card.EightOfClubs);
        expect(Card.FromString('9c')).toBe(Card.NineOfClubs);
        expect(Card.FromString('vc')).toBe(Card.ValetOfClubs);
        expect(Card.FromString('qc')).toBe(Card.QueenOfClubs);
        expect(Card.FromString('kc')).toBe(Card.KingOfClubs);
        expect(Card.FromString('xc')).toBe(Card.TenOfClubs);
        expect(Card.FromString('1c')).toBe(Card.ElevenOfClubs);
    });
});
describe('FromString', () => {
    it('should correctly parse valid card strings', () => {
        expect(Card.FromString('7h')).toBe(Card.SevenOfHearts);
        expect(Card.FromString('8d')).toBe(Card.EightOfDiamonds);
        expect(Card.FromString('9s')).toBe(Card.NineOfSpades);
        expect(Card.FromString('vc')).toBe(Card.ValetOfClubs);
        expect(Card.FromString('qh')).toBe(Card.QueenOfHearts);
        expect(Card.FromString('kd')).toBe(Card.KingOfDiamonds);
        expect(Card.FromString('xs')).toBe(Card.TenOfSpades);
        expect(Card.FromString('1c')).toBe(Card.ElevenOfClubs);
    });

    it('should be case insensitive', () => {
        expect(Card.FromString('7H')).toBe(Card.SevenOfHearts);
        expect(Card.FromString('Vc')).toBe(Card.ValetOfClubs);
        expect(Card.FromString('xS')).toBe(Card.TenOfSpades);
    });

    it('should throw error for invalid input', () => {
        expect(() => Card.FromString('')).toThrow();
        expect(() => Card.FromString('7')).toThrow();
        expect(() => Card.FromString('77h')).toThrow();
        expect(() => Card.FromString('7x')).toThrow();
        expect(() => Card.FromString('ah')).toThrow();
    });
});