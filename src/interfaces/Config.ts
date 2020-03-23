import {Snowflake} from 'discord.js';

export interface Config
{
    /** DiscordId **/
    owner: Snowflake;
    /** Command prefix **/
    prefix: string;
    /** Discord Token **/
    token: string;
}

/** @ignore */
export const ConfigExample: Config = {
    owner: 'UserID here.',
    prefix: '!',
    token: 'Your Token here.'
};
