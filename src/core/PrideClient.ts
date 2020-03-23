import {Client} from 'discord.js';

/**
 * Wrapper for Discord.Client
 * @category Core
 */
export class PrideClient
{
    private static readonly client = new Client();

    /**
     * Tries to login client with provided token. Stops process on failure.
     * @param {string} token Token provided by Discord, which can be stored in configuration file.
     */
    public static loginClient(token: string): void
    {
        this.client.login(token).catch(error =>
        {
            console.error(`An Error has occurred during login stage: ${error}`);
            process.exit(1);
        });
    }

    /**
     * Returns current instance of logged in client
     * @returns {Client}
     */
    public static getClient(): Client
    {
        return this.client;
    }
}
