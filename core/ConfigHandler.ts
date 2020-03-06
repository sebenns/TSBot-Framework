import * as fs from 'fs';

export class ConfigHandler
{
    private static readonly configPath = `${__dirname}/../config/config.json`;
    private static configuration: Config;

    public static getToken(): string { return this.configuration.token; }
    public static getCmdPrefix(): string { return this.configuration.prefix; }

    /**
     *  Creates a configuration file with some placeholder in config directory.
     */
    public static createConfigFile(): void
    {
        try
        {
            const configScheme: Config = {
                owner: 'UserID here.',
                prefix: '!',
                token : 'Your Token here.'
            };
            fs.writeFileSync(`${this.configPath}`, JSON.stringify(configScheme, null, 4));
        }
        catch (error)
        {
            console.error(`An Error has occurred during config write process: ${error}`);
            process.exit(1);
        }
    }

    /**
     * Reads the configuration file and stores the read JSON in the configuration attribute.
     * @throws Error, if configuration file does not exist.
     */
    public static loadConfig(): void
    {
        if (!fs.existsSync(this.configPath))
        {
            throw Error('The specified configuration file could not be found.');
        }

        try
        {
            this.configuration = JSON.parse(fs.readFileSync(`${this.configPath}`, 'utf-8'));
        }
        catch (error)
        {
            console.error(`An Error has occurred during config load process: ${error}`);
            process.exit(1);
        }
    }
}

interface Config
{
    owner: string;
    prefix: string;
    token: string;
}
