import * as glob from 'glob';
import * as path from 'path';

/**
 * FileLoader loads and caches files by filePattern (mostly javascript due to require implementation).
 * @category Utility
 */
export class FileLoader
{
    private fileList: any = {};
    private cfgList: any = {};

    /**
     * Getter method for configuration list filled with key, value pairs
     *
     * ```json
     * {
     *     instance: boolean,
     *     instance: boolean,
     *     instance: boolean,
     *     ...
     * }
     * ```
     * @returns {any} JSON Object
     */
    public getCfgList(): any
    {
        return this.cfgList;
    }

    /**
     * Getter method for an instanceObject filled with instances, their definitions and paths
     * ```json
     * {
     *     instance {
     *         fn: [instance],
     *         contents: [contents],
     *         path: "filePath"
     *     },
     *     ...
     * }
     * ```
     * @returns {any} JSON Object
     */
    public getFileList(): any
    {
        return this.fileList;
    }

    /**
     * Getter method for an array list filled with paths
     * @returns {string[]} pathList ['path', 'path', ... ]
     */
    public getPathList(): string[]
    {
        const pathList: string[] = [];

        for (const file of this.fileList)
        {
            pathList.push(file.path);
        }

        return pathList;
    }

    /**
     * Loads files in provided directory with provided filePattern, creates a configuration list and stores
     * a list of files as well as the configuration list in private attributes, which can be obtained by getter.
     * It is possible to provide a configuration, which will avoid loading unwanted files.
     * @param {string} filePattern Pattern for files, which should match
     * @param {any} cfg Configuration file with {identifier: boolean}
     */
    public requireFiles(filePattern: string, cfg?: any): void
    {
        const files: string[] = glob.sync(filePattern);
        const fileList = {}, cfgList = {};

        for (const file of files)
        {
            // Clear cache and create instance of required file.
            delete require.cache[require.resolve(file)];
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const instance = require(path.resolve(file));
            const instanceVal = Object.values(instance)[0];
            // If file does only provide contents, take fileName
            const identifier: string = typeof instanceVal === 'function' ?
                Object.keys(instance)[0] : path.posix.basename(file);

            if (instanceVal === undefined) continue;

            // Get configuration value of identifier, if it isn't set, set it to true.
            cfgList[identifier] = cfg && cfg[identifier] !== undefined ? cfg[identifier] : true;

            if (cfgList[identifier])
            {
                fileList[identifier] = {};
                fileList[identifier].path = file;

                // Initialize file if it contains a function, otherwise put it as contents
                if (typeof instanceVal === 'function')
                {
                    fileList[identifier].fn = new (Object.values(instance)[0] as any)();
                    console.info(`+ ${identifier} has been initialized`);
                }
                else fileList[identifier].contents = instance;
            }
        }

        this.cfgList = cfgList;
        this.fileList = fileList;
    }

    /**
     * Utility method for clearing require cache for provided fileList
     * @param {string[]} fileList Provide a list of files in a string array.
     */
    public static clearRequireCache(fileList: string[]): void
    {
        for (const file of fileList)
        {
            delete require.cache[path.resolve(file)];
        }
    }
}
