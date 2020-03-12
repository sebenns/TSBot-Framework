import {Command} from '../../interfaces/Command';
import {PrideClient} from '../../core/PrideClient';
import * as Discord from 'discord.js';
import {Token} from '../../utils/Tokenizer';
import {PrideHandler} from "./PrideHandler";

export class PrideCmd implements Command
{
    public command = [
        'pride',
        'prideBot'
    ];

    public arguments = [
        `\\breload(\\s(cmds|command(s)?|cmd|event(s)?))?`,
        `\\b(disable|dis)(\\s\\w+)`,
        `\\b(enable|en)(\\s\\w+)`
    ];

    public switchable = false;

    permissions(client: PrideClient, msg: Discord.Message): boolean
    {
        return true;
    }

    execute(client: PrideClient, msg: Discord.Message, tokens: Token[]): void
    {
        if (tokens && tokens.length > 0)
        {
            for (const argument of tokens)
            {
                if (argument.token.startsWith('reload'))
                    return PrideHandler.reload(argument.token, client, msg);
                if (argument.token.startsWith('disable') || argument.token.startsWith('dis'))
                    return PrideHandler.toggle(argument.token, false, msg);
                if (argument.token.startsWith('enable') || argument.token.startsWith('en'))
                    return PrideHandler.toggle(argument.token, true, msg);
            }
        }
    }
}
