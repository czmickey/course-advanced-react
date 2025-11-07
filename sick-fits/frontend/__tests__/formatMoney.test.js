import formatMoney from "../lib/formatMoney";

describe('format Money function', () => {
    it('works with fractional euros', () => {
        expect(formatMoney(1)).toEqual('0,01 €');
        expect(formatMoney(10)).toEqual('0,10 €');
        expect(formatMoney(9)).toEqual('0,09 €');
        expect(formatMoney(40)).toEqual('0,40 €');
    });

    it('leaves off cents when its whole euros', () => {
        expect(formatMoney(5000)).toEqual('50 €');
        expect(formatMoney(100)).toEqual('1 €');
        expect(formatMoney(500000)).toEqual('5 000 €');
    });

    it('works with whole and fractional euros', () => {
        expect(formatMoney(140)).toEqual('1,40 €');
        expect(formatMoney(5012)).toEqual('50,12 €');
        expect(formatMoney(110)).toEqual('1,10 €');
        expect(formatMoney(101)).toEqual('1,01 €');
        expect(formatMoney(101)).toEqual('1,01 €');
        expect(formatMoney(2345643245678675643546576)).toEqual('23 456 432 456 786 755 000 000,00 €');
    });
});