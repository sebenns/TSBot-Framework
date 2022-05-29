export class Tokenizer {
  public static tokenize(text: string, parsers: TokenExpr[]): Token[] {
    const tokenList: Token[] = [];
    let token: Token,
      result: any[],
      pos: number = text.length,
      index = 0;

    while (text.length > 0) {
      index =
        tokenList.length > 0
          ? tokenList[tokenList.length - 1].token.length + index
          : 0;

      for (const parser of parsers) {
        result = parser.regExpr.exec(text);

        if (result !== null && (result as any).index < pos) {
          token = {
            token: result[0],
            type: parser.type,
            position: index,
          };

          pos = (result as any).index;
        }
      }

      if (pos > 0) {
        tokenList.push({
          token: text.substr(0, pos),
          type: "undefined",
          position: index,
        });

        index = index + tokenList[tokenList.length - 1].token.length;
      }

      if (token) {
        token.position = index;
        tokenList.push(token);
      }

      text = text.substr(pos + (token ? token.token.length : 0));

      token = null;
      pos = text.length;
    }

    return tokenList;
  }
}

export interface Token {
  token: string;
  type: string;
  position: any;
}

export interface TokenExpr {
  regExpr: RegExp;
  type: string;
}
