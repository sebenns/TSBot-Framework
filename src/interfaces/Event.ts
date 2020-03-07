import {PrideClient} from "../core/PrideClient";

export interface Event
{
    // Defines the event (and name), which have been triggered
    eventName: string;

    // Execute code for this event with provided listener
    execute(client: PrideClient, listener: (...args: any[]) => void)
}
