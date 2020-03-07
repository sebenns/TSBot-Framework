import {ConfigHandler} from "../src/core/ConfigHandler";
import * as path from "path";
import * as fs from 'fs';
import {expect} from 'chai';
import 'mocha';

describe('Configuration Handler', () =>
{
    interface TestJSON {
        test: boolean;
    }

    const configPath = path.resolve(__dirname, '../src/config');
    const testFile = `${configPath}/test.json`;
    const testJSON: TestJSON = {test: true};

    before(() => {
        if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
    });

    after(() => {
        if (fs.existsSync(testFile)) fs.unlinkSync(testFile)
    });

    it('should create a configuration file', () =>
    {
        ConfigHandler.createConfigFile<TestJSON>('test', testJSON);
        expect(fs.existsSync(testFile)).to.equal(true);
    });

    it('should load a configuration file', () =>
    {
        const config = ConfigHandler.loadConfig<TestJSON>('test');
        expect(config.test).to.equal(true);
    });

    it('should fail loading non existent file', () =>
    {
        expect(() => ConfigHandler.loadConfig<any>('test1337file')).to.throw;
    });
});
