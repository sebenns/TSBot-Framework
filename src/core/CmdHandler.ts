import {ConfigHandler} from './ConfigHandler';
import {FileLoader} from '../utils/FileLoader';
import * as path from 'path';

export class CmdHandler
{
    private static cmdLoader = new FileLoader();

    /**
     * Loads command configuration file and returns it
     * @returns {any} config file {identifier: boolean};
     */
    private static loadConfig(): any
    {
        try {
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
}
