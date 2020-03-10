import * as Discord from 'discord.js';

/**
 * Wrapper for Discord.Client
 * @category Core
 */
export class PrideClient
{

    private readonly client: Discord.Client;

    constructor(token: string)
    {
        this.client = new Discord.Client();
        this.loginClient(token);
    }

    /**
     * Tries to login with provided token.
     * @param {string} token Token provided by Discord, which can be stored in configuration file.
     */
    private loginClient(token: string): void
    {
        this.client.login(token).catch(error =>
        {
            console.error(`An Error has occurred during login stage: ${error}`);
            process.exit(1);
        });
    }

    /**
     * Returns current instance of Discord.Client
     * @returns {Discord.Client} Current instance of Discord.Client
     */
    public getClient(): Discord.Client
    {
        return this.client;
    }
}
