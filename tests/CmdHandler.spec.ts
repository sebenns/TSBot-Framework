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
});
