export class Tokenizer
{

    /**
     * Accepts a text and divides it into individual tokens with position and typing. Written following @github/borgar.
     * @param {string} text - Text which should be tokenized
     * @param {TokenExpr[]} parsers - Define here different parser for tokenize
     * @returns {Token[]} - TokenList
     */
    public static tokenize(text: string, parsers: TokenExpr[]): Token[]
    {
        const tokenList: Token[] = [];
        let token: Token, result: any[], pos: number = text.length, index = 0;

        while (text.length > 0)
        {
            index = tokenList.length > 0 ? tokenList[tokenList.length - 1].token.length + index : 0;

            // Iterate through reg. expressions and execute on string
            for (const parser of parsers)
            {
                result = parser.regExpr.exec(text);

                // Take result which is next to beginning
                if (result !== null && (result as any).index < pos)
                {
                    token = {
                        token   : result[0],
                        type    : parser.type,
                        position: index
                    };

                    pos = (result as any).index;
                }
            }

            // If parser has not recognized character between two tokens, it gets undefined
            if (pos > 0)
            {
                tokenList.push(
                    {
                        token   : text.substr(0, pos),
                        type    : 'undefined',
                        position: index,
                    });

                index = index + tokenList[tokenList.length - 1].token.length;
            }

            // Push token in tokenList
            if (token)
            {
                token.position = index;
                tokenList.push(token);
            }

            text = text.substr(pos + (token ? token.token.length : 0));

            token = null;
            pos = text.length;
        }

        return tokenList;
    }

    /**
     * Filters tokens by provided filter and returns a new token list.
     * @param {string[]} filter - Filters are type-names in an array
     * @param {Token[]} tokens - Tokens which have to get filtered
     * @param inverse - it will return tokens !(by filter) if true
     * @returns {Token[]} - filtered tokenList
     */
    public static filterTokens(filter: string[], tokens: Token[], inverse = false): Token[]
    {
        const filteredTokens: Token[] = [];

        for (const token of tokens)
        {
            if (inverse && !filter.includes(token.type))
            {
                filteredTokens.push(token);
            }

            if (!inverse && filter.includes(token.type))
            {
                filteredTokens.push(token);
            }
        }

        return filteredTokens;
    }
}

export interface Token
{
    token: string;
    type: string;
    position: any;
}

export interface TokenExpr
{
    regExpr: RegExp;
    type: string;
}
