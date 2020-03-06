import * as glob from 'glob';
import * as path from 'path';

export class CmdHandler
{

    private static cmdList = {};
    private static cmdPath = `${__dirname}/../commands/*.js`;

    /**
     * Getter method for commandList attribute
     * @returns {any} List loaded commands
     */
    public static getCmdList(): any
    {
        return this.cmdList;
    }

    /**
     * Loads commands stored in commands directory.
     * Cache will be cleared on every method invoke.
     * Commands will be stored in commandList attribute.
     */
    public static loadCmdList(): void
    {
        console.info('Loading commands form directory...');

        const cmdFiles = glob.sync(this.cmdPath);
        const cmdList = {};

        for (const cmdFile of cmdFiles)
        {
            // Clear cache and create instance of required file.
            delete require.cache[require.resolve(cmdFile)];
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const instance = require(path.resolve(cmdFile));

            // Check if instance is empty
            if (!Object.keys(instance)[0] === null || !Object.keys(instance)[0] === undefined)
            {
                continue;
            }

            cmdList[Object.keys(instance)[0]] = {fn: new (Object.values(instance)[0] as any)(), path: cmdFile};
            console.info(`Command ${Object.keys(instance)[0]} has been initialized.`);
        }

        this.cmdList = cmdList;
    }
}
