import {Command} from '../interfaces/Command';
import {PrideClient} from '../core/PrideClient';
import * as Discord from 'discord.js';

export class HelpCmd implements Command
{
    public command = 'help';

    public switchable = false;

    public execute(client: PrideClient, msg: Discord.Message): void {
        console.log('execute');
    }

    public permissions(client: PrideClient, msg: Discord.Message): boolean {
        console.log('permission');
        return true;
    }
}
