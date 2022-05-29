import { Token } from "../utils/Tokenizer";

export class ExecHandler {
  public static run(actions: Action[], tokens: Token[], ...params): boolean {
    for (const argument of tokens) {
      let tokenLength = 0;
      const currAction = actions.find((action) =>
        action.token.find((token) => {
          tokenLength = token.length;
          return argument.token.startsWith(token);
        })
      );

      if (currAction) {
        currAction.call(argument.token.substr(tokenLength).trim(), ...params);
        return true;
      }
    }
    return false;
  }
}

export interface Action {
  token: string[];
  call: (token: any, ...params) => void;
}
