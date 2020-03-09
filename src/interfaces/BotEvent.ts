import {PrideClient} from '../core/PrideClient';

// How to build your small botEvent :)
export interface BotEvent
{
    // Defines the event (and name), which have been triggered
    eventName: string;

    // Execute code for this event with provided listener
    execute(client: PrideClient, ...args: any | any[]): void;
}
