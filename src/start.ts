import {PrideClient} from './core/PrideClient';
import {ConfigHandler} from './core/ConfigHandler';
import {CmdHandler} from './core/CmdHandler';
import {Config, ConfigExample} from './interfaces/Config';
import {EventHandler} from './core/EventHandler';

if (Number(process.versions.node.substring(0, process.versions.node.indexOf('.'))) < 12)
{
    console.error(`![NodeJS Version Check] Required Node version >= 12, you are currently running >>${process.version}<<
    As a result, some functions of Pride will not run properly. Please update your Node version.`);
    process.exit(1);
}

/** @ignore Current bot configuration */
let cfg: Config;

// Try to load configuration file. If it does not exist, create a new one and stop the current process.
try
{
    cfg = ConfigHandler.loadConfig<Config>('config');
}
catch (error)
{
    ConfigHandler.createConfig('config', ConfigExample);
    console.log('![Configuration] Configuration file has been created. Provide your Discord Token and restart.');
    process.exit(1);
}

// Try to load command prefix and commands out of command directory.
try
{
    CmdHandler.cmdPrefix = cfg.prefix;
    CmdHandler.loadCmdList();
}
catch (error)
{
    console.error(`![CmdInit] An Error has occurred during command loading: ${error}`);
    process.exit(1);
}

// Try to load events out of event directory.
try
{
    EventHandler.loadEvents();
}
catch (error)
{
    console.error(`![EventLoading] An Error has occurred during event loading: ${error}`);
}

// Login Discord client and store current logged instance in Pride Wrapper
PrideClient.loginClient(cfg.token);

try
{
    // Initial event loading, all instances will be triggered.
    EventHandler.registerEvents();

}
catch (error)
{
    console.error(`![EventRegister] An Error has occurred during event registering: ${error}`);
}
