import {Command} from '../../interfaces/Command';
import {Token} from '../../utils/Tokenizer';
import {Message} from 'discord.js';

export class HelpCmd implements Command
{
    public command = 'help';

    public arguments = '(page|p)(\\s)?[0-9]+';

    public permissions(msg: Message, tokens: Token[]): boolean {
        return true;
    }

    public execute(msg: Message, tokens: Token[]): void {
        console.log(tokens);
    }
}
