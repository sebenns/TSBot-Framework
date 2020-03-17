import {FileLoader} from '../utils/FileLoader';
import * as path from 'path';
import {TSCompiler} from "../utils/TSCompiler";
import * as glob from 'glob';
import * as ts from 'typescript';
import {PrideClient} from "./PrideClient";

/**
 * Event Handler with the following key features:
 *  <ul>
 *      <li>Return eventList, which has been loaded before.
 *      <li>Re/load event instances from event directory.
 * </ul>
 * @category Core
 */
export class EventHandler
{
    private static eventLoader = new FileLoader();

    /**
     * Returns current loaded list of events containing an instance of class and filePath. <br />
     * ```json
     * {
     *     instanceEvent: {
     *         fn : [instanceEvent],
     *         path : "filePath"
     *     },
     *     MessageEvent : {
     *         fn: [MessageEvent],
     *         path: "filePath"
     *     },
     *     ...
     * }
     * ```
     * @returns {json} Object {instanceEvent : {fn: [instanceEvent], path: string}}
     */
    public static getEventList(): any
    {
        return this.eventLoader.getFileList();
    }

    /**
     *  Re/loads all existing events in event directory as well as their modules.<br />
     *  All files listed in events directory will be recompiled by [[TSCompiler]]. Already cached files
     *  by require will be removed. Afterwards the [[FileLoader]] will reload all `*.event.js` instances as well
     *  as their imported modules.
     *  @param {boolean} recompile Defines if all files in events directory should get recompiled
     */
    public static loadEvents(recompile = false): void
    {
        console.info('[ >> Loading events from directory... ]');

        if (recompile)
        {
            const tsFiles: string[] = glob.sync(path.resolve(process.cwd(), 'src/events/**/*.ts'));
            TSCompiler.compile(tsFiles, {target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS});
            FileLoader.clearRequireCache(tsFiles.map(e => `${e.substr(0, e.lastIndexOf('.'))}.js`));
        }

        this.eventLoader.requireFiles(path.resolve(process.cwd(), 'src/events**/*.event.js'));

        console.info('[ >> Finished loading events. ]');
    }

    /**
     * Registers all events which have been loaded and stored in current eventList.
     */
    public static registerEvents(): void
    {
        // Get function values of current loaded eventList
        const instances: any = Object.values(this.eventLoader.getFileList());

        // Iterate through instances and set up event listener
        for (const instance of instances)
        {
            // Create Discord event listener and provide listener arguments
            PrideClient.getClient().on(instance.fn['eventName'],
                (...args) => { instance.fn['execute'](args.length > 1 ? args : args[0]) });
        }
    }

    /**
     * Unregisters and removes all existent listeners.
     */
    public static unregisterEvents(): void
    {
        PrideClient.getClient().removeAllListeners();
    }
}
