import {Token} from "../utils/Tokenizer";

/**
 * Execution Handler with the following key features:
 *  <ul>
 *      <li>Define your own [[Action]]s and run them just with one command.
 * </ul>
 * @category Core
 */
export class ExecHandler
{
    /**
     * Provide your previously defined [[Action]]s, retrieved [[Token]]s and optional parameters to run
     * some actions fitting your tokens in your defined [[Action]]s. Useful for execute() method.
     * @param {Action[]} actions Predefined [Action]s Array containing maps of token to action definitions.
     * @param {Token[]} tokens Provided [Token]s by execute() method.
     * @param params Additional parameters you wish to provide.
     * @returns {boolean} Returns true if any action has been executed.
     */
    public static run(actions: Action[], tokens: Token[], ...params): boolean
    {
        for (const argument of tokens)
        {
            let tokenLength = 0;
            const currAction = actions.find(action =>
                action.token.find(token =>
                {
                    tokenLength = token.length;
                    return argument.token.startsWith(token)
                }));

            if (currAction)
            {
                currAction.call(argument.token.substr(tokenLength).trim(), ...params);
                return true;
            }
        }
        return false;
    }
}

export interface Action
{
    // Token definition for your call, f.e. ['help']
    token: string[];
    // Call action to execute on fitting token, f.e. (token, msg) => { ... stuff(); }
    call: (token: any, ...params) => void;
}
