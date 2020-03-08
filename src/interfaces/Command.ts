import {PrideClient} from '../core/PrideClient';
import * as Discord from 'discord.js';

export interface Command
{
    // This will be your command, with possibly alternatives/aliases
    command: string|string[];

    // Define here if command is switchable (optional, default = true)
    switchable?: boolean;

    // (Optional) describe your command here
    description?: string;

    // (Optional) describe command usage here
    usage?: string;

    // Here you can create some permission checks
    permissions(client: PrideClient, msg: Discord.Message): boolean;

    // Pride will check on command syntax and afterwards just call this method.
    execute(client: PrideClient, msg: Discord.Message): void;
}
