import {PrideClient} from "./core/PrideClient";
import {ConfigHandler} from "./core/ConfigHandler";
import {CmdHandler} from "./core/CmdHandler";

// Loads the configuration file, if it does not exist, it will be created.
try
{
    ConfigHandler.loadConfig();
}
catch (error)
{
    ConfigHandler.createConfigFile();
    console.log('Configuration file has been created. Provide your Discord Token and restart.');
    process.exit(0);
}

CmdHandler.loadCmdList();

const token: string = ConfigHandler.getToken();
const pride: PrideClient = new PrideClient(token);

// EventHandling beneath
