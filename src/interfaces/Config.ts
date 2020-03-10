export interface Config
{
    /** DiscordId **/
    owner: string;
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
