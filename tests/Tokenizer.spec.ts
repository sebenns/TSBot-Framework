import {expect} from 'chai';
import 'mocha';
import {Token, TokenExpr, Tokenizer} from '../src/utils/Tokenizer';

describe('Tokenizer Test', () =>
{
    it('should correctly tokenize a string', () =>
    {
        const list: Token[] = Tokenizer.tokenize('The weather is quite nice today.',
            [
                {regExpr: new RegExp('\\w+'), type: 'word'},
                {regExpr: new RegExp('\\s+'), type: 'whitespace'},
                {regExpr: new RegExp('[^\\w\\s]'), type: 'punctuation'}
            ]);
        expect(list[0].token).to.be.equal('The');
        expect(list[0].type).equal('word');
        expect(list[1].token).to.be.equal(' ');
        expect(list[1].type).equal('whitespace');
        expect(list[list.length - 1].token).to.be.equal('.');
        expect(list[list.length - 1].type).equal('punctuation');
    });

    it('should recognize arguments in commands', () =>
    {
        const args = ['--test \\w+', '--cake'];
        const command = ['help'];
        const tokenExprs: TokenExpr[] = [];

        for (const arg of args)
        {
            tokenExprs.push(
                {regExpr: new RegExp(arg), type: 'argument'}
            )
        }

        const list: Token[] = Tokenizer.tokenize('!help --test apple --cake',
            [
                {regExpr: new RegExp('!\\w+'), type: 'command'},
                ...tokenExprs
            ]);

        expect(list[0].token).to.be.equal(`!${command[0]}`);
        expect(list[0].type).to.be.equal('command');
        expect(list[2].token).to.be.equal(`--test apple`);
        expect(list[2].type).to.be.equal('argument');
    });

    it('should filter arguments', () =>
    {
        const list: Token[] = Tokenizer.tokenize('!me --random love',
            [
                {regExpr: new RegExp('!\\w+'), type: 'command'},
                {regExpr: new RegExp('--random \\w+'), type: 'argument'}
            ]);
        const filteredList: Token[] = Tokenizer.filterTokens(['argument'], list);
        const invertedList: Token[] = Tokenizer.filterTokens(['argument'], list, true);

        expect(list[0].type).to.be.equal('command');
        expect(filteredList[0].type).to.be.equal('argument');
        expect(invertedList[0].type).to.be.equal('command');
    });
});
