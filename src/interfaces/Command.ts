import {PrideClient} from "../core/PrideClient";
import * as Discord from 'discord.js';

export interface Command
{
    // Combined with prefix this will be your command
    command: string;

    // Defines if command is switchable (optional, default = true)
    switchable?: boolean;

    // Here you can create some permission checks
    permissions(client: PrideClient, msg: Discord.Message): boolean;

    // Pride will check on command syntax and afterwards just call this method.
    execute(client: PrideClient, msg: Discord.Message): void;
}
