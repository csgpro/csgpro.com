// libs
import { expect } from 'chai';

// app
import { getProtocolByHost } from './utility';

describe('getProtocolByHost', () => {
    it('should return http', () => {
        expect(getProtocolByHost('localhost')).to.equal('http');
    });
    it('should return https', () => {
        expect(getProtocolByHost('www.notlocalhost.com')).to.equal('https');
    });
    it('should return https', () => {
        expect(getProtocolByHost('csgpro.com')).to.equal('https');
    });
});