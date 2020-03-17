import {BotEvent} from '../interfaces/BotEvent';
import * as Discord from 'discord.js';
import {CmdHandler} from '../core/CmdHandler';

export class MessageEvent implements BotEvent
{
    public eventName = 'message';

    public execute(msg: Discord.Message): void
    {
        // Commands will only get executed, if they start with the prefix set in configuration file.
        try
        {
            if (msg.content.startsWith(CmdHandler.cmdPrefix) && msg.content.charCodeAt(CmdHandler.cmdPrefix.length) !== 32)
            {
                CmdHandler.executeCmd(msg);
            }
        }
        catch (error)
        {
            console.error(`![CmdLoading] An Error occurred during command execution: ${error}`);
        }
    }
}
