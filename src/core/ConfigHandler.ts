import * as fs from 'fs';
import * as path from "path";

export class ConfigHandler
{
    private static readonly configPath = path.resolve(__dirname, '../config');

    /**
     * Creates a configuration file in config directory with provided name and data.
     * @param {string} fileName - name of configuration file
     * @param {any} json - data as JSON Object
     */
    public static createConfigFile<T>(fileName: string, json: T): void
    {
        try
        {
            fs.writeFileSync(path.resolve(this.configPath, `${fileName}.json`), JSON.stringify(json, null, 4));
        }
        catch (error)
        {
            console.error(`An Error has occurred during config write process: ${error}`);
            process.exit(1);
        }
    }

    /**
     * Loads the configuration file with provided fileName, throws Error if it does not exist.
     * @param {string} fileName - name of the file to check on.
     * @throws Error, if configuration file does not exist.
     */
    public static loadConfig<T>(fileName: string): T
    {
        if (!fs.existsSync(path.resolve(this.configPath, `${fileName}.json`)))
        {
            throw Error('The specified configuration file could not be found.');
        }

        try
        {
            return JSON.parse(fs.readFileSync(path.resolve(this.configPath, `${fileName}.json`), 'utf-8'));
        }
        catch (error)
        {
            console.error(`An Error has occurred during config load process: ${error}`);
            process.exit(1);
        }
    }
}
