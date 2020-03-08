import {BotEvent} from '../interfaces/BotEvent';
import {PrideClient} from '../core/PrideClient';
import * as Discord from 'discord.js';

export class MessageEvent implements BotEvent
{
    public eventName = 'message';

    public execute(client: PrideClient, msg: Discord.Message): void {
        console.log(msg.content);
    }
}
