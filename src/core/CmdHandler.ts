import * as glob from 'glob';
import * as path from 'path';
import {ConfigHandler} from "./ConfigHandler";

export class CmdHandler
{
    private static cmdList = {};
    private static cmdConfig;

    // Loads command configuration file and stores it in attribute.
    private static getCmdConfig(): void
    {
        try {
            this.cmdConfig = ConfigHandler.loadConfig<any>('commands');
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
    private static setCmdConfig(config: any): void
    {
        ConfigHandler.createConfigFile<any>('commands', config);
    }

    /**
     * Getter method for commandList attribute
     * @returns {any} command list
     */
    public static getCmdList(): any
    {
        return this.cmdList;
    }

    /**
     * Loads commands stored in commands directory.
     * Cache will be cleared on every method invoke.
     * Commands will be stored in commandList attribute.
     * Configuration file will be loaded and updated on every invoke.
     */
    public static loadCmdList(): void
    {
        console.info('>> Loading commands from directory...');

        this.getCmdConfig();

        const cmdFiles = glob.sync(`${path.resolve(__dirname, '../commands')}/**/*.cmd.js`);
        const cmdList = {}, cmdConfig = {};

        for (const cmdFile of cmdFiles)
        {
            // Clear cache and create instance of required file.
            delete require.cache[require.resolve(cmdFile)];
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const instance = require(path.resolve(cmdFile));

            // Check if instance file is not empty
            if (!Object.keys(instance)[0] === null || !Object.keys(instance)[0] === undefined)
            {
                continue;
            }

            const identifier: string = Object.keys(instance)[0];

            // Get configuration value of identifier, if it isn't set, set it to true.
            cmdConfig[identifier] = this.cmdConfig && this.cmdConfig[identifier] !== undefined ? this.cmdConfig[identifier] : true;

            // If configuration value of identifier is true, initialize command.
            if (cmdConfig[identifier])
            {
                cmdList[identifier] = {fn: new (Object.values(instance)[0] as any)(), path: cmdFile};
                console.info(`+ Command ${identifier} has been initialized.`);
            }
        }

        this.setCmdConfig(cmdConfig);
        this.cmdList = cmdList;

        console.info('>> Finished loading commands.');
    }
}
