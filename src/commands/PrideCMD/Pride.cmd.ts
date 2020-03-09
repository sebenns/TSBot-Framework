import {Command} from '../../interfaces/Command';
import {PrideClient} from '../../core/PrideClient';
import * as Discord from 'discord.js';
import {Token} from '../../utils/Tokenizer';
import {CmdHandler} from '../../core/CmdHandler';
import {EventHandler} from '../../core/EventHandler';
import * as glob from 'glob';
import * as path from 'path';
import {TSCompiler} from '../../utils/TSCompiler';
import ts = require('typescript');

enum reloadArg
{
    reload   = '--reload',
    commands = 'cmds',
    events   = 'events',
}

enum disableArg
{
    disable = '--disable'
}

export class PrideCmd implements Command
{

    public command = [
        'pride',
        'prideBot'
    ];

    public arguments = [
        `${reloadArg.reload}(\\s(${reloadArg.commands}|${reloadArg.events}))?`,
        `${disableArg.disable}`
    ];

    public switchable = false;

    permissions(client: PrideClient, msg: Discord.Message): boolean
    {
        return true;
    }

    execute(client: PrideClient, msg: Discord.Message, tokens: Token[]): void
    {
        if (tokens && tokens.length > 0)
        {
            for (const token of tokens)
            {
                if (token.token.startsWith(reloadArg.reload)) return this.reload(token.token, client, msg);
            }
        }
    }

    /**
     * Reloads the set of commands/events via CommandHandler/EventHandler
     * @param {string} token: token with arguments if provided
     * @param {PrideClient} client: PrideClient for event reloading
     * @param {Discord.Message} msg: Current posted message object
     */
    private reload(token: string, client: PrideClient, msg: Discord.Message): void
    {
        const arg = token.split(/\s/)[1];
        const tsOptions: ts.CompilerOptions = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
        };

        if (arg === reloadArg.commands || !arg)
        {
            // Get all typescript files, compile them and then reload command list
            const tsFiles = glob.sync(`${path.resolve(process.cwd(), 'src/commands')}/**/*.cmd.ts`);
            TSCompiler.compile(tsFiles, tsOptions);

            CmdHandler.loadCmdList();

            msg.channel.send('Your commands have been successfully reloaded.');
        }

        if (arg === reloadArg.events || !arg)
        {
            // Get all typescript files, compile them and then reload event list
            const tsFiles = glob.sync(`${path.resolve(process.cwd(), 'src/events')}/**/*.event.ts`);
            TSCompiler.compile(tsFiles, tsOptions);

            EventHandler.unregisterEvents(client);
            EventHandler.loadEvents();
            EventHandler.registerEvents(client);

            msg.channel.send('Your events and commands have been successfully reloaded.');
        }
    }
}
