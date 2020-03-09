import {FileLoader} from '../utils/FileLoader';
import * as path from 'path';
import {PrideClient} from './PrideClient';

export class EventHandler
{

    private static eventLoader = new FileLoader();

    /**
     * Getter method for a list of events
     * @returns {any} event list
     */
    public static getEventList(): void
    {
        return this.eventLoader.getFileList();
    }

    /**
     * Loads events stored in events directory.
     * Cache will be cleared on every method invoke.
     * List of events will be available in eventLoader
     */
    public static loadEvents(): void
    {
        console.info('>> Loading events from directory...');

        this.eventLoader.loadFiles(path.resolve(process.cwd(), 'src/events'), `/**/*.event.js`);

        console.info('>> Finished loading events.');
    }

    /**
     * Registers all provided Discord events
     * @param {PrideClient} client, current instance of prideClient
     */
    public static registerEvents(client: PrideClient): void
    {
        // Get function values of current loaded eventList
        const instances: any = Object.values(this.eventLoader.getFileList());

        // Iterate through instances and set up event listener
        for (const instance of instances)
        {
            // Create Discord event listener and provide listener arguments
            client.getClient().on(instance.fn['eventName'],
                (...args) => { instance.fn['execute'](client, args.length > 1 ? args : args[0]) });
        }
    }

    /**
     * Unregisters all provided Discord events
     * @param {PrideClient} client, current instance of prideClient
     */
    public static unregisterEvents(client: PrideClient): void
    {
       client.getClient().removeAllListeners();
    }
}
