import {expect} from 'chai';
import 'mocha';
import {EventHandler} from '../src/core/EventHandler';

describe('Event Handler', () =>
{
    it('should load all existent events', () =>
    {
        EventHandler.loadEvents();
        expect(EventHandler.getEventList()).to.not.equal(undefined);
    });
});
