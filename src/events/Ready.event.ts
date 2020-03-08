import {BotEvent} from "../interfaces/BotEvent";
import {PrideClient} from '../core/PrideClient';

export class ReadyEvent implements BotEvent
{
    public eventName = 'ready';

    public execute(client: PrideClient): void
    {
        console.info(`${client.getClient().user.username} has successfully logged in and is now listening on events.`);
    }
}
