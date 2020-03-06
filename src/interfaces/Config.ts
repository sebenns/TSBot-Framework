export interface Config
{
    owner: string;
    prefix: string;
    token: string;
}

export const ConfigExample: Config = {
    owner: 'UserID here.',
    prefix: '!',
    token: 'Your Token here.'
};
