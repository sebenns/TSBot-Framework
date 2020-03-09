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
    /**
     * Reloads the set of commands/events via CommandHandler/EventHandler
     * @param {string} token: token with arguments if provided
     * @param {PrideClient} client: PrideClient for event reloading
     * @param {Discord.Message} msg: Current posted message object
     */
    public static reload(token: string, client: PrideClient, msg: Discord.Message): void
    {
        const arg: string = token.split(/\s/)[1];
        const tsOptions: ts.CompilerOptions = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
        };

        if (arg === 'cmds' || !arg)
        {
            // Get all typescript files, compile them and then reload command list
            const tsFiles: string[] = glob.sync(`${path.resolve(process.cwd(), 'src/commands')}/**/*.ts`);
            TSCompiler.compile(tsFiles, tsOptions);

            CmdHandler.loadCmdList();

            msg.channel.send('Your commands have been successfully reloaded.');
        }

        if (arg === 'events' || !arg)
        {
            // Get all typescript files, compile them and then reload event list
            const tsFiles: string[] = glob.sync(`${path.resolve(process.cwd(), 'src/events')}/**/*.event.ts`);
            TSCompiler.compile(tsFiles, tsOptions);

            EventHandler.unregisterEvents(client);
            EventHandler.loadEvents();
            EventHandler.registerEvents(client);

            msg.channel.send('Your events and commands have been successfully reloaded.');
        }
    }

    public static disable(token: string, client: PrideClient, msg: Discord.Message): void
    {
        const arg: string = token.split(/\s/)[1];
        const cfgFile: any = CmdHandler.loadConfig();
        const cmdList: any = CmdHandler.getCmdList();

        for (const instance of Object.keys(cfgFile))
        {
            console.log(instance.substr(instance.length - 3).toLocaleLowerCase());
            console.log(arg);
            if (instance.substr(instance.length - 3).toLocaleLowerCase() === arg.toLocaleLowerCase() &&
                (cmdList[instance].fn['switchable'] === undefined || cmdList[instance].fn['switchable'] === true))
            {
                cfgFile[instance] = false;
            }
        }

        console.log(cfgFile);
    }
}
