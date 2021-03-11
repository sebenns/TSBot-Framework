import {Command} from '../../interfaces/Command';
import {Token} from '../../utils/Tokenizer';
import {PrideHandler} from "./PrideHandler";
import {CmdHandler} from "../../core/CmdHandler";
import {Message} from 'discord.js';
import {PermHandler} from "../../core/PermHandler";
import {Action, ExecHandler} from "../../core/ExecHandler";

export class PrideCmd implements Command
{
    public command = [
        'pride',
        'prideBot'
    ];

    public arguments = [
        `\\b(reload|r)(\\s(cmds|command(s)?|cmd|event(s)?))?`,
        `\\b(disable|dis)(\\s\\w+)`,
        `\\b(enable|en)(\\s\\w+)`,
        `\\b(avatar|ava)\\shttp(s)?:\\/\\/[\\w.\\/]+`,
        `\\b(username|uname)\\s.+`,
        `\\bprefix\\s[^\\s]+`,
        `\\bowner\\s<@![0-9]+>`
    ];

    public usage = [
        `${CmdHandler.cmdPrefix}pride reload/r cmd(s)|event(s)`,
        `${CmdHandler.cmdPrefix}pride disable/dis <command>`,
        `${CmdHandler.cmdPrefix}pride enable/en <command>`,
        `${CmdHandler.cmdPrefix}pride avatar <url>`,
        `${CmdHandler.cmdPrefix}pride username <new username here>`,
        `${CmdHandler.cmdPrefix}pride prefix <new prefix here>`,
        `${CmdHandler.cmdPrefix}pride owner <@Owner>`
    ];

    public description = 'Make basic settings with the Pride command. De/activate commands, change username, avatar and prefix, transfer ownership.';

    public switchable = false;

    permissions(msg: Message): boolean
    {
        return PermHandler.isPrideOwner(msg) || PermHandler.isOwner(msg);
    }

    execute(msg: Message, tokens: Token[]): void
    {
        // Filter through tokens and execute action for specified token
        if (!tokens || tokens.length === 0)
            return PrideHandler.help(this.usage, msg);

        {
            const actions: Action[] = [
                {
                    token: ['reload', 'r'],
                    call : (token, msg): void => PrideHandler.reload(token, msg)
                },
                {
                    token: ['disable', 'dis'],
                    call : (token, msg): void => PrideHandler.disable(token, msg)
                },
                {
                    token: ['enable', 'en'],
                    call : (token, msg): void => PrideHandler.enable(token, msg)
                },
                {
                    token: ['avatar', 'ava'],
                    call : (token, msg): void => PrideHandler.changeAvatar(token, msg)
                },
                {
                    token: ['username', 'uname'],
                    call : (token, msg): void => PrideHandler.changeUserName(token, msg)
                },
                {
                    token: ['prefix'],
                    call : (token, msg): void => PrideHandler.changePrefix(token, msg)
                },
                {
                    token: ['owner'],
                    call : (token, msg): void => PrideHandler.changeOwner(token, msg)
                }
            ];

            ExecHandler.run(actions, tokens, msg)
        }
    }
}
