import * as fs from 'fs';
import * as path from 'path';

export class ConfigHandler
{
    private static readonly configPath = path.resolve(process.cwd(), 'src/config');

    /**
     * Creates a configuration file in config directory with provided name and data.
     * @param {string} fileName - name of configuration file
     * @param {T} json - data as JSON Object
     */
    public static createConfigFile<T>(fileName: string, json: T): void
    {
        fs.writeFileSync(path.resolve(this.configPath, `${fileName}.json`), JSON.stringify(json, null, 4));
    }

    /**
     * Loads the configuration file with provided fileName, throws Error if it does not exist.
     * @param {string} fileName - name of the file to check on.
     * @returns {T} JSON object
     */
    public static loadConfig<T>(fileName: string): T
    {
        return JSON.parse(fs.readFileSync(path.resolve(this.configPath, `${fileName}.json`), 'utf-8'));
    }
}
