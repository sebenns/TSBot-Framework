import {Command} from "../interfaces/Command";
import {PrideClient} from "../core/PrideClient";
import * as Discord from 'discord.js';

export class Help implements Command
{
    public command = 'help';
    public switchable = false;

    public execute(client: PrideClient, msg: Discord.Message): void {
        console.log('Help!');
    }
}
