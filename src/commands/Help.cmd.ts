import {Command} from '../interfaces/Command';
import {PrideClient} from '../core/PrideClient';
import * as Discord from 'discord.js';
import {Token} from '../utils/Tokenizer';

export class HelpCmd implements Command
{
    public command = 'help';

    public arguments = '--all';

    public switchable = false;

    public execute(client: PrideClient, msg: Discord.Message, tokens: Token[]): void {
        return;
    }

    public permissions(client: PrideClient, msg: Discord.Message, tokens: Token[]): boolean {
        return true;
    }
}
