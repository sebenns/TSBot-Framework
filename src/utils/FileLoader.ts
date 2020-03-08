import * as glob from 'glob';
import * as path from 'path';

export class FileLoader
{

    private fileList: any = {};
    private cfgList: any = {};

    // Returns configuration list of loader.
    public getCfgList(): any
    {
        return this.cfgList;
    }

    // Returns file list of loader.
    public getFileList(): any
    {
        return this.fileList;
    }

    /**
     * Loads files in provided directory with provided filePattern, creates a configuration list and stores
     * a list of files as well as the configuration list in private attributes, which can be obtained by getter.
     * It is possible to provide a configuration, which will avoid loading unwanted files.
     * @param {string} dir - directory with files, which will be loaded
     * @param {string} filePattern - pattern for files, which should match
     * @param cfg - configuration file with {identifier: boolean}
     */
    public loadFiles(dir: string, filePattern: string, cfg?: any): void
    {
        const files = glob.sync(`${dir}${filePattern}`);
        const fileList = {}, cfgList = {};

        for (const file of files)
        {
            // Clear cache and create instance of required file.
            delete require.cache[require.resolve(file)];
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const instance = require(path.resolve(file));
            const identifier: string = Object.keys(instance)[0];

            // Check if instance file is not empty
            if (!identifier === null || !identifier === undefined)
            {
                continue;
            }

            // Get configuration value of identifier, if it isn't set, set it to true.
            cfgList[identifier] = cfg && cfg[identifier] !== undefined ? cfg[identifier] : true;

            // If configuration value of identifier is true, initialize command.
            if (cfgList[identifier])
            {
                fileList[identifier] = {fn: new (Object.values(instance)[0] as any)(), path: file};
                console.info(`+ ${identifier} has been initialized`);
            }
        }

        this.cfgList = cfgList;
        this.fileList = fileList;
    }
}
