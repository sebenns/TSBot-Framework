import {Command} from '../../interfaces/Command';
import {PrideClient} from '../../core/PrideClient';
import * as Discord from 'discord.js';

export class PrideCmd implements Command {

    public command = 'pride';

    public switchable = false;

    permissions(client: PrideClient, msg: Discord.Message): boolean {
        return true;
    }

    execute(client: PrideClient, msg: Discord.Message): void {
        return;
    }
}
