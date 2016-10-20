// libs
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as hapi from 'hapi';

// app
import { register } from './';

let server: hapi.Server;

beforeEach(() => {
    server = new hapi.Server();
    server.connection({});
});

describe('errorHandler', () => {
    it('should be registered', (done) => {
        server.register({ register }, (err) => {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should initialize the server', (done) => {
        server.initialize((err) => {
            expect(err).to.not.exist;
            done();
        });
    });
});

