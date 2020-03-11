import {PrideClient} from '../../core/PrideClient';
import {CmdHandler} from '../../core/CmdHandler';
import {EventHandler} from '../../core/EventHandler';
import * as Discord from 'discord.js';
import {MessageEmbed} from 'discord.js';

export class PrideHandler
{
    // Reloads the set of commands/events via CommandHandler/EventHandler
    public static reload(token: string, client: PrideClient, msg: Discord.Message): void
    {
        const arg: string = token.split(/\s/)[1];
        let response = '';

        if (!arg || arg.match('cmds|command(s)?|cmd'))
        {
            CmdHandler.loadCmdList();
            response += 'Your commands have been successfully reloaded.\n';
        }

        if (!arg || arg.match('event(s)?'))
        {
            EventHandler.unregisterEvents(client);
            EventHandler.loadEvents();
            EventHandler.registerEvents(client);
            response += 'Your events have been successfully reloaded.\n';
        }

        msg.channel.send(new MessageEmbed().setColor(5871377)
            .setAuthor(`${String.fromCodePoint(0x2705)} Success!`).setDescription(response));
    }

    // Toggles en/disable status of provided command in arguments via CommandHandler
    public static toggle(token: string, activate: boolean, msg: Discord.Message): void
    {
        const arg: string = token.split(/\s/)[1];
        const cfgFile: any = CmdHandler.loadConfig();
        const cmdList: any = CmdHandler.getCmdList();

        for (const instance of Object.keys(cfgFile))
        {
            // Check if argument does exist in cfgFile
            if (instance.substr(0, instance.length - 3).toLocaleLowerCase() === arg.toLocaleLowerCase())
            {
                // Check if instance exists in commandList and is switchable while trying to disable a command
                if ((cmdList[instance] && (cmdList[instance].fn['switchable'] === undefined || cmdList[instance].fn['switchable'] === true) && !activate) ||
                    // Check if instance is already false in config file while trying to enable a command
                    (cfgFile[instance] === false && activate))
                {
                    cfgFile[instance] = activate;

                    // Store changed configuration file, reload command list and display change message
                    CmdHandler.createConfigFile(cfgFile);
                    CmdHandler.loadCmdList();

                    msg.channel.send(new MessageEmbed().setColor(activate ? 5871377 : 12386326)
                        .setAuthor(activate ? `${String.fromCodePoint(0x1F7E2)} Enabled ${arg}!` : `${String.fromCodePoint(0x1F534)} Disabled ${arg}!`)
                        .setDescription(`The command ${CmdHandler.cmdPrefix}${arg} was successfully ${activate ? 'enabled' : 'disabled'}.`));

                    break;
                }
            }
        }
    }
}
