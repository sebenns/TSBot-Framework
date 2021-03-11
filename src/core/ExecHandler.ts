import {Token} from "../utils/Tokenizer";

export class ExecHandler
{
    public static run(actions: Action[], tokens: Token[], ...params): boolean
    {
        for (const argument of tokens)
        {
            let tokenLength = 0;
            const currHandler = actions.find(handler =>
                handler.token.find(token =>
                {
                    tokenLength = token.length;
                    return argument.token.startsWith(token)
                }));

            if (currHandler)
            {
                currHandler.action(argument.token.substr(tokenLength).trim(), ...params);
                return true;
            }
        }
        return false;
    }
}

export interface Action
{
    token: string[];
    action: (token: any, ...params) => void;
}
