import {PrideClient} from '../../core/PrideClient';
import {TSCompiler} from '../../utils/TSCompiler';
import {CmdHandler} from '../../core/CmdHandler';
import {EventHandler} from '../../core/EventHandler';
import * as Discord from 'discord.js';
import * as path from 'path';
import * as glob from 'glob';
import ts = require('typescript');

export class PrideHandler
{
    // Reloads the set of commands/events via CommandHandler/EventHandler
    public static reload(token: string, client: PrideClient, msg: Discord.Message): void
    {
        const arg: string = token.split(/\s/)[1];
        const tsOptions: ts.CompilerOptions = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
        };

        if (arg.match('cmds|command(s)?|cmd') || !arg)
        {
            // Get all typescript files, compile them and then reload command list
            const tsFiles: string[] = glob.sync(`${path.resolve(process.cwd(), 'src/commands')}/**/*.ts`);
            TSCompiler.compile(tsFiles, tsOptions);

            this.clearFileCache(tsFiles);
            CmdHandler.loadCmdList();

            msg.channel.send('Your commands have been successfully reloaded.');
        }

        if (arg.match('event(s)?') || !arg)
        {
            // Get all typescript files, compile them and then reload event list
            const tsFiles: string[] = glob.sync(`${path.resolve(process.cwd(), 'src/events')}/**/*.ts`);
            TSCompiler.compile(tsFiles, tsOptions);

            this.clearFileCache(tsFiles);
            EventHandler.unregisterEvents(client);
            EventHandler.loadEvents();
            EventHandler.registerEvents(client);

            msg.channel.send('Your events and commands have been successfully reloaded.');
        }
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
                    msg.channel.send(`The command ${arg} was successfully ${activate ? 'enabled' : 'disabled'}.`);

                    break;
                }
            }
        }
    }

    /**
     * Deletes cache from required javascript files, provide fileList with typescript files
     * @param {string} fileList - typescript files, which have compiled javascript files
     */
    private static clearFileCache(fileList: string[]): void
    {
        for (const file of fileList)
        {
            delete require.cache[path.resolve(`${file.substr(0, file.lastIndexOf('.'))}.js`)];
        }
    }
}
