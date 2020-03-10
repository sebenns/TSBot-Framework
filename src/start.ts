import {PrideClient} from './core/PrideClient';
import {ConfigHandler} from './core/ConfigHandler';
import {CmdHandler} from './core/CmdHandler';
import {Config, ConfigExample} from './interfaces/Config';
import {EventHandler} from './core/EventHandler';

/** @ignore Current bot configuration */
let cfg: Config;

// Loads the configuration file, if it does not exist, it will be created.
try
{
    cfg = ConfigHandler.loadConfig<Config>('config');
}
catch (error)
{
    ConfigHandler.createConfigFile('config', ConfigExample);
    console.log('Configuration file has been created. Provide your Discord Token and restart.');
    process.exit(1);
}

try
{
    CmdHandler.cmdPrefix = cfg.prefix;
    CmdHandler.loadCmdList();
}
catch (error)
{
    console.error(`An Error has occurred during command loading: ${error}`);
    process.exit(1);
}

try
{
    EventHandler.loadEvents();
}
catch (error)
{
    console.error(`An Error has occurred during event loading: ${error}`);
}

/** Current instance of PrideClient */
const pride: PrideClient = new PrideClient(cfg.token);

// Initial event loading, all instances will be triggered.
// Commands will be loaded afterwards.
EventHandler.registerEvents(pride);
