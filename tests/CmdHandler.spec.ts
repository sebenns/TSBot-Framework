import {CmdHandler} from '../src/core/CmdHandler';
import {expect} from 'chai';
import 'mocha';

describe('Command Handler', () =>
{
    it('should load all existent commands', () =>
    {
        CmdHandler.loadCmdList();
        expect(CmdHandler.getCmdList()).to.not.equal(undefined);
    });

    it('should load an existent configuration file for commands', () =>
    {
        expect(CmdHandler.loadConfig()).to.not.equal(undefined);
    });

    it('should generate a correct configuration file', () =>
    {
        const config: any = CmdHandler.loadConfig();
        CmdHandler.createConfig(config);
        const newConfig: any = CmdHandler.loadConfig();

        for (const key of Object.keys(newConfig))
        {
            expect(newConfig[key]).equal(config[key]);
        }
    });

    it('should make functions executable', () =>
    {
        CmdHandler.loadCmdList();
        const cmdList = CmdHandler.getCmdList();
        const objKeys = Object.keys(cmdList);
        expect(cmdList[objKeys[0]].fn).to.be.an('Object');
    });
});
