import {BotEvent} from '../interfaces/BotEvent';
import {PrideClient} from '../core/PrideClient';
import * as Discord from 'discord.js';
import {CmdHandler} from '../core/CmdHandler';

export class MessageEvent implements BotEvent
{
    public eventName = 'message';

    public execute(client: PrideClient, msg: Discord.Message): void {
        if (msg.content.startsWith(CmdHandler.cmdPrefix) && msg.content.charCodeAt(CmdHandler.cmdPrefix.length) !== 32)
        {
            return;
        }
    }
}
