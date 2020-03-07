import * as Discord from 'discord.js';

export class PrideClient
{

    private readonly client: Discord.Client;

    constructor(token: string)
    {
        this.client = new Discord.Client();
        this.loginClient(token);
    }

    /**
     * Tries to login client with provided token.
     * @param {string} token - Discord token
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
     * Getter for created Discord.Client instance
     * @returns {Discord.Client}
     */
    public getClient(): Discord.Client
    {
        return this.client;
    }
}
