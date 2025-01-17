import Card from '../src/Card';

describe('Card.ToString', () => {
    test('all cards have correct string representation', () => {
        expect(Card.ToString(Card.SevenOfHearts)).toBe('7H');
        expect(Card.ToString(Card.EightOfHearts)).toBe('8H');
        expect(Card.ToString(Card.NineOfHearts)).toBe('9H');
        expect(Card.ToString(Card.ValetOfHearts)).toBe('VH');
        expect(Card.ToString(Card.QueenOfHearts)).toBe('QH');
        expect(Card.ToString(Card.KingOfHearts)).toBe('KH');
        expect(Card.ToString(Card.TenOfHearts)).toBe('XH');
        expect(Card.ToString(Card.ElevenOfHearts)).toBe('1H');

        expect(Card.ToString(Card.SevenOfDiamonds)).toBe('7D');
        expect(Card.ToString(Card.EightOfDiamonds)).toBe('8D');
        expect(Card.ToString(Card.NineOfDiamonds)).toBe('9D');
        expect(Card.ToString(Card.ValetOfDiamonds)).toBe('VD');
        expect(Card.ToString(Card.QueenOfDiamonds)).toBe('QD');
        expect(Card.ToString(Card.KingOfDiamonds)).toBe('KD');
        expect(Card.ToString(Card.TenOfDiamonds)).toBe('XD');
        expect(Card.ToString(Card.ElevenOfDiamonds)).toBe('1D');

        expect(Card.ToString(Card.SevenOfSpades)).toBe('7S');
        expect(Card.ToString(Card.EightOfSpades)).toBe('8S');
        expect(Card.ToString(Card.NineOfSpades)).toBe('9S');
        expect(Card.ToString(Card.ValetOfSpades)).toBe('VS');
        expect(Card.ToString(Card.QueenOfSpades)).toBe('QS');
        expect(Card.ToString(Card.KingOfSpades)).toBe('KS');
        expect(Card.ToString(Card.TenOfSpades)).toBe('XS');
        expect(Card.ToString(Card.ElevenOfSpades)).toBe('1S');

        expect(Card.ToString(Card.SevenOfClubs)).toBe('7C');
        expect(Card.ToString(Card.EightOfClubs)).toBe('8C');
        expect(Card.ToString(Card.NineOfClubs)).toBe('9C');
        expect(Card.ToString(Card.ValetOfClubs)).toBe('VC');
        expect(Card.ToString(Card.QueenOfClubs)).toBe('QC');
        expect(Card.ToString(Card.KingOfClubs)).toBe('KC');
        expect(Card.ToString(Card.TenOfClubs)).toBe('XC');
        expect(Card.ToString(Card.ElevenOfClubs)).toBe('1C');
    });
});
