import {ConfigHandler} from './ConfigHandler';
import {FileLoader} from '../utils/FileLoader';
import * as path from 'path';
import {PrideClient} from './PrideClient';
import * as Discord from 'discord.js';
import {Token, TokenExpr, Tokenizer} from '../utils/Tokenizer';

export class CmdHandler
{
    private static cmdLoader = new FileLoader();
    public static cmdPrefix: string;

    /**
     * Loads command configuration file and returns it
     * @returns {any} config file {identifier: boolean};
     */
    public static loadConfig(): any
    {
        try
        {
            return ConfigHandler.loadConfig<any>('commands');
        }
        catch (error)
        {
            console.info('Configuration file for "Commands" does not exist.');
            return;
        }
    }

    /**
     * Creates configuration file with provided config object.
     * @param config - object with command status
     */
    private static createConfigFile(config: any): void
    {
        ConfigHandler.createConfigFile<any>('commands', config);
    }

    /**
     * Getter method for a list of commands
     * @returns {any} command list
     */
    public static getCmdList(): any
    {
        return this.cmdLoader.getFileList();
    }

    /**
     * Loads commands stored in commands directory.
     * Cache will be cleared on every method invoke.
     * List of commands will be available in cmdLoader
     */
    public static loadCmdList(): void
    {
        console.info('>> Loading commands from directory...');

        this.cmdLoader.loadFiles(path.resolve(process.cwd(), 'src/commands'), `/**/*.cmd.js`, this.loadConfig());
        this.createConfigFile(this.cmdLoader.getCfgList());

        console.info('>> Finished loading commands.');
    }

    /**
     * Executes the provided command via message, checks if it exists and executes it with a generated tokenList.
     * @param {PrideClient} client - PrideClient
     * @param {Discord.Message} msg - Discord message with provided command
     */
    public static executeCmd(client: PrideClient, msg: Discord.Message): void
    {
        // Get function values of current loaded command list
        const instances: any = Object.values(this.cmdLoader.getFileList());
        // Get current executed command and remove cmdPrefix from the beginning
        const execCmd: string = msg.content.split(' ')[0].substring(this.cmdPrefix.length).toLocaleLowerCase();

        // Iterate through instances of commandFiles
        for (const instance of instances)
        {
            const command: string | string[] = instance.fn['command'];

            // Check if command does exist in instance
            if ((!Array.isArray(command) && command.toLocaleLowerCase() === execCmd) ||
                (Array.isArray(command) && command.map(e => e.toLocaleLowerCase()).includes(execCmd)))
            {
                const argExprs: TokenExpr[] = [];
                const args: string | string[] = instance.fn['arguments'];

                // Check if arguments have been created and create a regExprList
                if (args !== undefined)
                {
                    if (!Array.isArray(args))
                    {
                        argExprs.push({regExpr: new RegExp(args), type: 'arguments'});
                    }

                    if (Array.isArray(args))
                    {
                        for (const arg of args)
                        {
                            argExprs.push({regExpr: new RegExp(arg), type: 'arguments'});
                        }
                    }
                }

                // Generate a tokenList and invoke permissions() and execute()
                const tokenList: Token[] = argExprs.length > 0 ? Tokenizer.filterTokens(['arguments'], Tokenizer.tokenize(msg.content, argExprs)) : [];

                if (instance.fn['permissions'](client, msg, tokenList))
                {
                    instance.fn['execute'](client, msg, tokenList);
                }
            }
        }
    }
}
