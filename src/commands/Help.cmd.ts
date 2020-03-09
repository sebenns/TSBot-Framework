import {Command} from '../interfaces/Command';
import {PrideClient} from '../core/PrideClient';
import * as Discord from 'discord.js';
import {Token} from '../utils/Tokenizer';

export class HelpCmd implements Command
{
    public command = 'help';

    public arguments = '--page [0-9]+';

    public switchable = false;

    public execute(client: PrideClient, msg: Discord.Message, tokens: Token[]): void {
        console.log('hello');
        return;
    }

    public permissions(client: PrideClient, msg: Discord.Message, tokens: Token[]): boolean {
        return false;
    }
}
