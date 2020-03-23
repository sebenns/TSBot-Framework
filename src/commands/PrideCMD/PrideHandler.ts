import {CmdHandler} from '../../core/CmdHandler';
import {EventHandler} from '../../core/EventHandler';
import {Message, MessageEmbed} from 'discord.js';
import * as util from 'util';
import {PrideClient} from '../../core/PrideClient';
import {LangHandler} from '../../core/LangHandler';
import {Config} from '../../interfaces/Config';
import {ConfigHandler} from '../../core/ConfigHandler';

export class PrideHandler
{
    public static lang = LangHandler.getLanguage(__dirname);

    // Reloads the set of commands/events via CommandHandler/EventHandler
    public static reload(token: string, msg: Message): void
    {
        const embed = new MessageEmbed().setColor(this.lang.color.green);
        let response = '';

        if (!token || token.match('cmds|command(s)?|cmd'))
        {
            CmdHandler.loadCmdList(true);
            response += this.lang.reload.cmds;
        }

        if (!token || token.match('event(s)?'))
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
    public static enable(token: string, msg: Message): void
    {
        const cfgFile: any = CmdHandler.loadConfig();
        const embed = new MessageEmbed();

        for (const instance of Object.keys(cfgFile))
        {
            if (instance.substr(0, instance.length - 3).toLocaleLowerCase() === token.toLocaleLowerCase())
            {
                if (cfgFile[instance] === false)
                {
                    cfgFile[instance] = true;
                    CmdHandler.createConfig(cfgFile);
                    CmdHandler.loadConfig();

                    embed.setColor(this.lang.color.green)
                        .setAuthor(util.format(this.lang.toggle.enabled, String.fromCodePoint(this.lang.icons.greenCircle), token))
                        .setDescription(util.format(this.lang.toggle.enabledDesc, `${CmdHandler.cmdPrefix}${token}`));
                }
                else
                {
                    embed.setColor(this.lang.color.red)
                        .setAuthor(util.format(this.lang.toggle.enabledAlready, String.fromCodePoint(this.lang.icons.crossMark), token))
                        .setDescription(util.format(this.lang.toggle.enabledAlreadyDesc, `${CmdHandler.cmdPrefix}${token}`));
                }

                msg.channel.send(embed);
                return;
            }
        }

        embed.setColor(this.lang.color.red)
            .setAuthor(util.format(this.lang.toggle.notFound, String.fromCodePoint(this.lang.icons.questionMark), token))
            .setDescription(util.format(this.lang.toggle.notFoundDesc, `${CmdHandler.cmdPrefix}${token}`, CmdHandler.cmdPrefix));

        msg.channel.send(embed);
    }

    // Disables commands and reloads commandList
    public static disable(token: string, msg: Message): void
    {
        const cfgFile: any = CmdHandler.loadConfig();
        const cmdList: any = CmdHandler.getCmdList();
        const embed = new MessageEmbed();

        for (const instance of Object.keys(cfgFile))
        {
            if (instance.substr(0, instance.length - 3).toLocaleLowerCase() === token.toLocaleLowerCase())
            {
                if (cmdList[instance] && (cmdList[instance].fn['switchable'] === undefined || cmdList[instance].fn['switchable'] === true))
                {
                    cfgFile[instance] = false;
                    CmdHandler.createConfig(cfgFile);
                    CmdHandler.loadCmdList();

                    embed.setColor(this.lang.color.red)
                        .setAuthor(util.format(this.lang.toggle.disabled, String.fromCodePoint(this.lang.icons.redCircle), token))
                        .setDescription(util.format(this.lang.toggle.disabledDesc, `${CmdHandler.cmdPrefix}${token}`));
                }
                else
                {
                    embed.setColor(this.lang.color.red)
                        .setAuthor(util.format(this.lang.toggle.disabledAlready, String.fromCodePoint(this.lang.icons.crossMark), token))
                        .setDescription(util.format(this.lang.toggle.disabledAlreadyDesc, `${CmdHandler.cmdPrefix}${token}`));
                }

                msg.channel.send(embed);
                return;
            }
        }

        embed.setColor(this.lang.color.red)
            .setAuthor(util.format(this.lang.toggle.notFound, String.fromCodePoint(this.lang.icons.questionMark), token))
            .setDescription(util.format(this.lang.toggle.notFoundDesc, `${CmdHandler.cmdPrefix}${token}`, CmdHandler.cmdPrefix));

        msg.channel.send(embed);
    }

    // Changes current avatar of prideBot
    public static changeAvatar(token: string, msg: Message): void
    {
        const embed = new MessageEmbed();

        PrideClient.getClient().user.setAvatar(token)
            .then(() => msg.channel.send(embed.setColor(this.lang.color.green)
                .setAuthor(util.format(this.lang.avatar.success, String.fromCodePoint(this.lang.icons.checkMark)))
                .setDescription(this.lang.avatar.successDesc)))

            .catch(() => msg.channel.send(embed.setColor(this.lang.color.red)
                .setAuthor(util.format(this.lang.avatar.failure, String.fromCodePoint(this.lang.icons.crossMark)))
                .setDescription(this.lang.avatar.failureDesc)));
    }

    // Changes username of prideBot - rate limited to two changes per hour
    public static changeUserName(token: string, msg: Message): void
    {
        if (token.startsWith('\'') && token.endsWith('\'') || token.startsWith('"') && token.endsWith('"'))
            token = token.substr(1, token.length - 2);
        const embed = new MessageEmbed();

        msg.channel.send(embed.setColor(this.lang.color.blue)
            .setAuthor(util.format(this.lang.username.info, String.fromCodePoint(this.lang.icons.infoMark)))
            .setDescription(this.lang.username.infoDesc));

        PrideClient.getClient().user.setUsername(token)
            .then(() => msg.channel.send(embed.setColor(this.lang.color.green)
                .setAuthor(util.format(this.lang.username.success, String.fromCodePoint(this.lang.icons.checkMark)))
                .setDescription(this.lang.username.successDesc)))

            .catch(() => msg.channel.send(embed.setColor(this.lang.color.red)
                .setAuthor(util.format(this.lang.username.failure, String.fromCodePoint(this.lang.icons.crossMark)))
                .setDescription(this.lang.username.failureDesc)));
    }

    // Changes current bot command prefix and replaces it with provided token
    public static changePrefix(token: string, msg: Message): void
    {
        // Load configuration file and change prefix.
        const cfg: Config = ConfigHandler.loadConfig<Config>('config');
        cfg.prefix = token;

        // Reset prefix in CommandHandler and store new configuration, reload Commands.
        CmdHandler.cmdPrefix = cfg.prefix;
        CmdHandler.loadCmdList();
        ConfigHandler.createConfig<Config>('config', cfg);

        msg.channel.send(new MessageEmbed().setColor(this.lang.color.green)
            .setAuthor(util.format(this.lang.prefix.success, String.fromCodePoint(this.lang.icons.checkMark)))
            .setDescription(util.format(this.lang.prefix.successDesc, token)));
    }

    // Changes owner to provided discord id
    public static changeOwner(token: string, msg: Message): void
    {
        // User mention is starting with <@! and ending with >
        const userId = token.substring(token.indexOf('!') + 1, token.lastIndexOf('>'));

        const cfg: Config = ConfigHandler.loadConfig<Config>('config');
        cfg.owner = userId;

        // Store new configuration file
        ConfigHandler.createConfig<Config>('config', cfg);

        msg.channel.send(new MessageEmbed().setColor(this.lang.color.green)
            .setAuthor(util.format(this.lang.owner.success, String.fromCodePoint(this.lang.icons.checkMark)))
            .setDescription(util.format(this.lang.owner.successDesc, token)));
    }

    // Displays all possible arguments
    public static help(usage: string[], msg: Message): void
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
