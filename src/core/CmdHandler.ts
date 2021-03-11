import {ConfigHandler} from './ConfigHandler';
import {FileLoader} from '../utils/FileLoader';
import * as path from 'path';
import {Token, TokenExpr, Tokenizer} from '../utils/Tokenizer';
import {TSCompiler} from '../utils/TSCompiler';
import * as glob from 'glob';
import * as ts from 'typescript';
import {Message} from 'discord.js';

/**
 * Command Handler with the following key features:
 *  <ul>
 *      <li>Re/load and re/create configuration file for commands (`config/commands.json`).
 *      <li>Return commandList, which has been loaded before.
 *      <li>Re/load command instances from command directory.
 * </ul>
 * @category Core
 */
export class CmdHandler
{
    private static cmdLoader = new FileLoader();

    /** Contains current prefix for commands. */
    public static cmdPrefix: string;

    /**
     * Loads current command configuration file from config directory and returns it.
     * Configuration file contains key value pairs, where a key is an instance and the value defines whether the command is active.
     * ```json
     * {
     *     instanceCmd : boolean,
     *     HelpCmd : true,
     *     PrideCmd : true,
     *     ...
     * }
     * ```
     * @returns {json} Object {instanceCmd: boolean, instanceCmd: boolean, ...}
     */
    public static loadConfig(): any
    {
        try
        {
            return ConfigHandler.loadConfig<any>('commands');
        }
        catch (error)
        {
            console.info('![CmdHandler] Configuration file for "Commands" does not exist.');
            return;
        }
    }

    /**
     * Creates a configuration file in config directory with provided configuration.
     * Configuration provided as json must look like:
     * ```json
     * {
     *     instanceCmd: boolean,
     *     instanceCmd: boolean,
     *     ...
     * }
     * ```
     * @param config - object with command status
     */
    public static createConfig(config: any): void
    {
        ConfigHandler.createConfig<any>('commands', config);
    }

    /**
     * Returns current loaded list of commands containing an instance of class and filePath. <br />
     * Disabled commands won't be listed here.
     * ```json
     * {
     *     instanceCmd: {
     *         fn : [instanceCmd],
     *         path : "filePath"
     *     },
     *     HelpCmd : {
     *         fn: [HelpCmd],
     *         path: "filePath"
     *     },
     *     ...
     * }
     * ```
     * @returns {json} Object {instanceCmd : {fn: [instanceCmd], path: string}}
     */
    public static getCmdList(): any
    {
        return this.cmdLoader.getFileList();
    }

    /**
     *  Re/loads all existing commands in command directory as well as their modules.<br />
     *  All files listed in commands directory will be recompiled by [[TSCompiler]]. Already cached files
     *  by require will be removed. Afterwards the [[FileLoader]] will reload all `*.cmd.js` instances as well
     *  as their imported modules. Configuration file will take impact on loaded commands.
     *  @param {boolean} recompile Defines if all files in commands directory should get recompiled
     */
    public static loadCmdList(recompile = false): void
    {
        console.info('[ >> Loading commands from directory... ]');

        if (recompile)
        {
            // Get full commands directory and re/compile typescript files, afterwards clear javascript require cache
            const tsFiles: string[] = glob.sync(path.resolve(process.cwd(), 'src/commands/**/*.ts'));
            TSCompiler.compile(tsFiles, {target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS});
            FileLoader.clearRequireCache(tsFiles.map(e => `${e.substr(0, e.lastIndexOf('.'))}.js`));
        }

        // Load command instances and initialize them
        this.cmdLoader.requireFiles(path.resolve(process.cwd(), 'src/commands/**/*.cmd.js'), this.loadConfig());
        this.createConfig(this.cmdLoader.getCfgList());

        console.info('[ >> Finished loading commands. ]');
    }

    /**
     * Execute command events if provided message.content starts with cmdPrefix and the command itself.
     * If arguments exist in an instance of a command, the message will be tokenized and arguments will get filtered.
     * @param {Message} msg Discord Message object
     */
    public static executeCmd(msg: Message): void
    {
        // Get function values of current loaded command list
        const instances: any = Object.values(this.cmdLoader.getFileList());
        // Get current executed command and remove cmdPrefix from the beginning
        const execCmd: string = msg.content.substring(this.cmdPrefix.length).toLocaleLowerCase().split(' ')[0];

        // Iterate through instances of commandFiles
        for (const instance of instances)
        {
            const command: string | string[] = instance.fn['command'];
            if (!command) continue;

            // Check if command does exist in instance
            if ((!Array.isArray(command) && command.toLocaleLowerCase() === execCmd) ||
                (Array.isArray(command) && command.some(e => e.toLocaleLowerCase() === execCmd)))
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
                const msgContent: string = msg.content.substring(this.cmdPrefix.length + execCmd.length);
                const tokenList: Token[] = argExprs.length > 0 ? Tokenizer.tokenize(msgContent, argExprs).filter((el: Token) => el.type === 'arguments') : [];

                if (instance.fn['permissions'](msg, tokenList))
                {
                    instance.fn['execute'](msg, tokenList);
                }
            }
        }
    }
}
