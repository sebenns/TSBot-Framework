import {CmdHandler} from '../../core/CmdHandler';
import {EventHandler} from '../../core/EventHandler';
import * as Discord from 'discord.js';
import {MessageEmbed} from 'discord.js';
import * as util from "util";
import {LangHandler} from "../../core/LangHandler";

export class PrideHandler
{
    public static lang = LangHandler.getLanguage(__dirname);

    // Reloads the set of commands/events via CommandHandler/EventHandler
    public static reload(token: string, msg: Discord.Message): void
    {
        const embed = new MessageEmbed().setColor(this.lang.color.green);

        const arg: string = token.split(/\s/)[1];
        let response = '';

        if (!arg || arg.match('cmds|command(s)?|cmd'))
        {
            CmdHandler.loadCmdList(true);
            response += this.lang.reload.cmds;
        }

        if (!arg || arg.match('event(s)?'))
        {
            EventHandler.unregisterEvents();
            EventHandler.loadEvents(true);
            EventHandler.registerEvents();
            response += this.lang.reload.events;
        }

        msg.channel.send(embed
            .setAuthor(util.format(this.lang.reload.success, String.fromCodePoint(this.lang.icons.checkMark)))
            .setDescription(response));
    }

    // Enables commands and reloads commandList
    public static enable(token: string, msg: Discord.Message): void
    {
        const arg: string = token.split(/\s/)[1];
        const cfgFile: any = CmdHandler.loadConfig();
        const embed = new MessageEmbed();

        for (const instance of Object.keys(cfgFile))
        {
            if (instance.substr(0, instance.length - 3).toLocaleLowerCase() === arg.toLocaleLowerCase())
            {
                if (cfgFile[instance] === false)
                {
                    cfgFile[instance] = true;
                    CmdHandler.createConfig(cfgFile);
                    CmdHandler.loadConfig();

                    embed.setColor(this.lang.color.green)
                        .setAuthor(util.format(this.lang.toggle.enabled, String.fromCodePoint(this.lang.icons.greenCircle), arg))
                        .setDescription(util.format(this.lang.toggle.enabledDesc, `${CmdHandler.cmdPrefix}${arg}`));
                }
                else
                {
                    embed.setColor(this.lang.color.red)
                        .setAuthor(util.format(this.lang.toggle.enabledAlready, String.fromCodePoint(this.lang.icons.crossMark), arg))
                        .setDescription(util.format(this.lang.toggle.enabledAlreadyDesc, `${CmdHandler.cmdPrefix}${arg}`));
                }

                msg.channel.send(embed);
                return;
            }
        }

        embed.setColor(this.lang.color.red)
            .setAuthor(util.format(this.lang.toggle.notFound, String.fromCodePoint(this.lang.icons.questionMark), arg))
            .setDescription(util.format(this.lang.toggle.notFoundDesc, `${CmdHandler.cmdPrefix}${arg}`, CmdHandler.cmdPrefix));

        msg.channel.send(embed);
    }

    // Disables commands and reloads commandList
    public static disable(token: string, msg: Discord.Message): void
    {
        const arg: string = token.split(/\s/)[1];
        const cfgFile: any = CmdHandler.loadConfig();
        const cmdList: any = CmdHandler.getCmdList();
        const embed = new MessageEmbed();

        for (const instance of Object.keys(cfgFile))
        {
            if (instance.substr(0, instance.length - 3).toLocaleLowerCase() === arg.toLocaleLowerCase())
            {
                if (cmdList[instance] && (cmdList[instance].fn['switchable'] === undefined || cmdList[instance].fn['switchable'] === true))
                {
                    cfgFile[instance] = false;
                    CmdHandler.createConfig(cfgFile);
                    CmdHandler.loadCmdList();

                    embed.setColor(this.lang.color.red)
                        .setAuthor(util.format(this.lang.toggle.disabled, String.fromCodePoint(this.lang.icons.redCircle), arg))
                        .setDescription(util.format(this.lang.toggle.disabledDesc, `${CmdHandler.cmdPrefix}${arg}`));
                }
                else
                {
                    embed.setColor(this.lang.color.red)
                        .setAuthor(util.format(this.lang.toggle.disabledAlready, String.fromCodePoint(this.lang.icons.crossMark), arg))
                        .setDescription(util.format(this.lang.toggle.disabledAlreadyDesc, `${CmdHandler.cmdPrefix}${arg}`));
                }

                msg.channel.send(embed);
                return;
            }
        }

        embed.setColor(this.lang.color.red)
            .setAuthor(util.format(this.lang.toggle.notFound, String.fromCodePoint(this.lang.icons.questionMark), arg))
            .setDescription(util.format(this.lang.toggle.notFoundDesc, `${CmdHandler.cmdPrefix}${arg}`, CmdHandler.cmdPrefix));

        msg.channel.send(embed);
    }

    public static changeAvatar(token: string, msg: Discord.Message): void
    {
        console.log('avatar' + token);
    }

    public static changeName(token: string, msg: Discord.Message): void
    {
        console.log('name' + token);
    }

    public static changeActivity(token: string, msg: Discord.Message): void
    {
        console.log('activity' + token);
    }

    // Displays all possible arguments
    public static help(usage: string[], msg: Discord.Message): void
    {
        let concCmd = '```';
        usage.forEach(use => concCmd += `${use}\n`);
        concCmd += '```';

        const embed = new MessageEmbed().setColor(this.lang.color.red)
            .setAuthor(util.format(this.lang.help.commandList, String.fromCodePoint(this.lang.icons.questionMark)))
            .setDescription(util.format(this.lang.help.commandListDesc, concCmd));

        msg.channel.send(embed);
    }
}
