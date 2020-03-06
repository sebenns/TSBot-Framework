import {PrideClient} from "../core/PrideClient";
import * as Discord from 'discord.js';

export interface Command
{
    // Combined with suffix this will be your command
    command: string;

    // Defines if the command can be turned off
    switchable: boolean;

    // Pride will check on command syntax and afterwards just call this method.
    execute(client: PrideClient, msg: Discord.Message): void;
}
