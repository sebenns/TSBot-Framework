import * as fs from 'fs';
import * as path from 'path';

/**
 * Config Handler with the following key features:
 *  <ul>
 *      <li>Load configuration files by fileName
 *      <li>Create configuration files with provided fileName and JSON Object
 * </ul>
 * @category Core
 */
export class ConfigHandler
{
    private static readonly configPath = path.resolve(process.cwd(), 'src/config');

    /**
     * Creates a configuration file with provided config of a generic type
     * @param {string} fileName Defines the configuration fileName
     * @param {T} json Data as JSON object, which will be stored in configuration file.
     */
    public static createConfig<T>(fileName: string, json: T): void
    {
        fs.writeFileSync(path.resolve(this.configPath, `${fileName}.json`), JSON.stringify(json, null, 4));
    }

    /**
     * Loads a configuration file by provided fileName, parses its content as JSON and returns it.
     * @param {string} fileName Defines the configuration fileName
     * @returns {T} JSON Object
     */
    public static loadConfig<T>(fileName: string): T
    {
        return JSON.parse(fs.readFileSync(path.resolve(this.configPath, `${fileName}.json`), 'utf-8'));
    }
}
