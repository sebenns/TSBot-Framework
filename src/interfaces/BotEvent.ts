import {PrideClient} from '../core/PrideClient';

/**
 * Implement this interface if you want to create your own event.
 *
 * ```typescript
 * export class MessageEvent implements BotEvent
 * {
 *      public eventName: 'message';
 *
 *      public execute(client, msg): void
 *      {
 *          // Execute code here on message event
 *      }
 * }
 * ```
 * @category General
 */
export interface BotEvent
{
    /** Define here your event name, which has to be existent as Discord event in DiscordJS library. */
    eventName: string;

    /**
     * On eventLoad this code will be invoked by default. You can handle here your event.
     * @param {PrideClient} client Current instance of PrideClient
     * @param {any} args Arguments which will be provided by Discord event
     */
    execute(client: PrideClient, ...args: any | any[]): void;
}
