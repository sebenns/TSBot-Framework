import {Command} from '../../interfaces/Command';
import * as Discord from 'discord.js';
import {Token} from '../../utils/Tokenizer';
import {PrideHandler} from "./PrideHandler";

export class PrideCmd implements Command
{
    public command = [
        'pride',
        'prideBot'
    ];

    public arguments = [
        `\\breload(\\s(cmds|command(s)?|cmd|event(s)?))?`,
        `\\b(disable|dis)(\\s\\w+)`,
        `\\b(enable|en)(\\s\\w+)`,
        `\\b(avatar|ava)\\shttp(s)?:\\/\\/[\\w.\\/]+`,
        `\\b(username|name)\\s.+`,
        `\\bactivity\\s.+`
    ];

    public usage = [
        '!pride reload cmd(s)|event(s)',
        '!pride disable/dis <command>',
        '!pride enable/en <command>',
        '!pride avatar <url>',
        '!pride username <new username here>',
        '!pride activity <new activity here>'
    ];

    public switchable = false;

    permissions(msg: Discord.Message): boolean
    {
        return true;
    }

    execute(msg: Discord.Message, tokens: Token[]): void
    {
        if (tokens && tokens.length > 0)
        {
            const handler = [
                {
                    token : ['reload'],
                    action: (token, msg): void => PrideHandler.reload(token, msg)
                },
                {
                    token : ['disable', 'dis'],
                    action: (token, msg): void => PrideHandler.disable(token, msg)
                },
                {
                    token : ['enable', 'en'],
                    action: (token, msg): void => PrideHandler.enable(token, msg)
                },
                {
                    token : ['avatar', 'ava'],
                    action: (token, msg): void => PrideHandler.changeAvatar(token, msg)
                },
                {
                    token: ['username', 'name'],
                    action: (token, msg): void => PrideHandler.changeName(token, msg)
                },
                {
                    token: ['activity'],
                    action: (token, msg): void => PrideHandler.changeActivity(token, msg)
                }
            ];

            for (const argument of tokens)
            {
                const currHandler = handler.find(handler =>
                    handler.token.find(token =>
                        argument.token.startsWith(token)));

                if (currHandler) return currHandler.action(argument.token, msg);
            }
        }

        return PrideHandler.help(this.usage, msg);
    }
}
