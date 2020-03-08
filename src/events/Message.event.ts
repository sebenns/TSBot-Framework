import {BotEvent} from '../interfaces/BotEvent';
import {PrideClient} from '../core/PrideClient';
import * as Discord from 'discord.js';
import {CmdHandler} from '../core/CmdHandler';

export class MessageEvent implements BotEvent
{
    public eventName = 'message';

    public execute(client: PrideClient, msg: Discord.Message): void
    {
        // Commands will only get executed, if they start with the prefix set in configuration file.
        try
        {
            if (msg.content.startsWith(CmdHandler.cmdPrefix) && msg.content.charCodeAt(CmdHandler.cmdPrefix.length) !== 32)
            {
                CmdHandler.executeCmd(client, msg);
            }
        }
        catch (error)
        {
            console.error(`An Error occurred during command execution: ${error}`);
        }
    }
}
