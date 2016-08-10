import * as mocha from 'mocha';
import * as chai from 'chai';
import * as server from '../';
import * as hapi from 'hapi';

const expect = chai.expect;

describe('Server', () => {
    it('should be instance of hapi.Server', () => {
        expect(server).instanceof(hapi.Server);
    });
});