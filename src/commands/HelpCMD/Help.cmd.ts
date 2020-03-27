import {Command} from '../../interfaces/Command';
import {Token} from '../../utils/Tokenizer';
import {Message} from 'discord.js';
import {HelpHandler} from "./HelpHandler";

export class HelpCmd implements Command
{
    public command = 'help';

    public arguments = [
        '(page|p)(\\s)?[0-9]+',
        '(usage|u)(\\s)?.+'
    ];

    public permissions(): boolean
    {
        return true;
    }

    public execute(msg: Message, tokens: Token[]): void
    {
        const handler = [
            {
                token : ['page', 'p'],
                action: (token, msg): void => HelpHandler.sendHelpList(Number(token), msg)
            },
            {
                token : ['usage', 'u'],
                action: (token, msg): void => HelpHandler.sendUsage(token, msg)
            }
        ];

        for (const argument of tokens)
        {
            const currHandler = handler.find(handler =>
                handler.token.find(token =>
                    argument.token.startsWith(token)));

            if (currHandler)
            {
                if (argument.token.indexOf(' ') < 0) argument.token = '';
                return currHandler.action(argument.token.substr(argument.token.indexOf(' ') + 1), msg);
            }
        }

        return HelpHandler.sendHelpList(0, msg);
    }
}
