import {Command} from '../../interfaces/Command';
import {Token} from '../../utils/Tokenizer';
import {Message} from 'discord.js';
import {HelpHandler} from "./HelpHandler";
import {CmdHandler} from "../../core/CmdHandler";
import {Action, ExecHandler} from "../../core/ExecHandler";

export class HelpCmd implements Command
{
    public command = 'help';

    public arguments = [
        '(page|p)(\\s)?[0-9]+',
        '(usage|u)(\\s).+',
        '(entries|e)(\\s)?[0-9]+'
    ];

    public usage = [
        `${CmdHandler.cmdPrefix}help p <page number> (e <entries number>)`,
        `${CmdHandler.cmdPrefix}help e <entries number>`,
        `${CmdHandler.cmdPrefix}help u <command>`
    ];

    public description = 'With the help command you get all necessary information about commands and their usage.';

    public switchable = false;

    // Class Attributes
    private entriesPerPage = 15;

    public permissions(): boolean
    {
        return true;
    }

    public execute(msg: Message, tokens: Token[]): void
    {
        if (!tokens || tokens.length === 0)
            return HelpHandler.sendHelpList(0, this.entriesPerPage, msg);

        const actions: Action[] = [
            {
                token : ['page', 'p'],
                action: (token, msg): void => this.sendHelpList(tokens, token, msg)
            },
            {
                token : ['entries', 'e'],
                action: (token, msg): void => HelpHandler.sendHelpList(0, token, msg)
            },
            {
                token : ['usage', 'u'],
                action: (token, msg): void => HelpHandler.sendUsage(token, msg)
            }
        ];

        ExecHandler.run(actions, tokens, msg)
    }

    // Wrapper for calling the sendHelpList function of HelpHandler with entriesToken (if provided)
    private sendHelpList(tokens: Token[], token: Token, msg: Message): void
    {
        let entriesTokenValue = this.entriesPerPage;

        const entriesToken = tokens.find((key: Token) =>
            key.token.startsWith(('entries')) || key.token.startsWith(('e')));

        if (entriesToken) entriesTokenValue = Number(entriesToken.token.match(/\d+/g).join(''));
        HelpHandler.sendHelpList(Number(token), entriesTokenValue, msg);
    }
}
