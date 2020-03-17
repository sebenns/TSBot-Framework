import {PrideClient} from '../../core/PrideClient';
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
    public static reload(token: string, client: PrideClient, msg: Discord.Message): void
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
            EventHandler.unregisterEvents(client);
            EventHandler.loadEvents(true);
            EventHandler.registerEvents(client);
            response += this.lang.reload.events;
        }

        msg.channel.send(embed
            .setAuthor(util.format(this.lang.reload.success, String.fromCodePoint(this.lang.icons.checkMark)))
            .setDescription(response));
    }

    // Toggles en/disable status of provided command in arguments via CommandHandler
    public static toggle(token: string, enable: boolean, msg: Discord.Message): void
    {
        const arg: string = token.split(/\s/)[1];
        const cfgFile: any = CmdHandler.loadConfig();
        const cmdList: any = CmdHandler.getCmdList();
        const embed = new MessageEmbed();
        let cmdFound = false;

        for (const instance of Object.keys(cfgFile))
        {
            // Check if argument does exist in cfgFile
            if (instance.substr(0, instance.length - 3).toLocaleLowerCase() === arg.toLocaleLowerCase())
            {
                cmdFound = true;

                // Config is already set to false while enabling or command is existent in command list and switchable while disabling
                if (cfgFile[instance] === false && enable || (cmdList[instance] && (cmdList[instance].fn['switchable'] === undefined || cmdList[instance].fn['switchable'] === true) && !enable))
                {
                    cfgFile[instance] = enable;
                    CmdHandler.createConfig(cfgFile);
                    CmdHandler.loadCmdList();

                    // En/disable messages on success
                    if (enable)
                        embed.setColor(this.lang.color.green)
                            .setAuthor(util.format(this.lang.toggle.enabled, String.fromCodePoint(this.lang.icons.greenCircle), arg))
                            .setDescription(util.format(this.lang.toggle.enabledDesc, `${CmdHandler.cmdPrefix}${arg}`));
                    else
                        embed.setColor(this.lang.color.red)
                            .setAuthor(util.format(this.lang.toggle.disabled, String.fromCodePoint(this.lang.icons.redCircle), arg))
                            .setDescription(util.format(this.lang.toggle.disabledDesc, `${CmdHandler.cmdPrefix}${arg}`));
                    break;
                }

                // Already en/disabled messages
                if (enable)
                    embed.setColor(this.lang.color.red)
                        .setAuthor(util.format(this.lang.toggle.enabledAlready, String.fromCodePoint(this.lang.icons.crossMark), arg))
                        .setDescription(util.format(this.lang.toggle.enabledAlreadyDesc, `${CmdHandler.cmdPrefix}${arg}`));
                else
                    embed.setColor(this.lang.color.red)
                        .setAuthor(util.format(this.lang.toggle.disabledAlready, String.fromCodePoint(this.lang.icons.crossMark), arg))
                        .setDescription(util.format(this.lang.toggle.disabledAlreadyDesc, `${CmdHandler.cmdPrefix}${arg}`));
                break;
            }
        }

        // If command could not be found
        if (!cmdFound)
        {
            embed.setColor(this.lang.color.red)
                .setAuthor(util.format(this.lang.toggle.notFound, String.fromCodePoint(this.lang.icons.questionMark), arg))
                .setDescription(util.format(this.lang.toggle.notFoundDesc, `${CmdHandler.cmdPrefix}${arg}`, CmdHandler.cmdPrefix));
        }

        msg.channel.send(embed);
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
