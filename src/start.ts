import {PrideClient} from "./core/PrideClient";
import {ConfigHandler} from "./core/ConfigHandler";
import {CmdHandler} from "./core/CmdHandler";
import {Config, ConfigExample} from "./interfaces/Config";

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
    process.exit(0);
}

CmdHandler.loadCmdList();

const pride: PrideClient = new PrideClient(cfg.token);

// EventHandling beneath
