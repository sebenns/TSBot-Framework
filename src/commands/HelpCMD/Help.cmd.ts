import {Command} from '../../interfaces/Command';
import * as Discord from 'discord.js';
import {Token} from '../../utils/Tokenizer';

export class HelpCmd implements Command
{
    public command = 'help';

    public arguments = '(page|p)(\\s)?[0-9]+';

    public permissions(msg: Discord.Message, tokens: Token[]): boolean {
        return true;
    }

    public execute(msg: Discord.Message, tokens: Token[]): void {
        msg.channel.send(`I can't help you :(`);
        return;
    }
}
