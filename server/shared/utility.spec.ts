// libs
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as fs from 'fs';

// app
import { pageView, getProtocolByHost } from './utility';
let existsSyncStub: sinon.SinonStub;

beforeEach(() => {
    existsSyncStub = sinon.stub(fs, 'existsSync', (path: string) => {
        return (/page-foo\.html$/.test(path));
    });
});

afterEach(() => {
    existsSyncStub.restore();
});

describe('pageView', () => {
    it('should return \'page-foo\'', () => {
        expect(pageView('foo')).to.equal('page-foo');
    });
    it('should return \'page\'', () => {
        expect(pageView('bar')).to.equal('page');
    });
});

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