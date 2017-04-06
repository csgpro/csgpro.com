// libs
import { expect } from 'chai';
import * as hapi from 'hapi';

// app
import MainController from './main.controller';

let server: hapi.Server;

beforeEach(() => {
    server = new hapi.Server();
    server.connection({});
});

describe('Main Controller', () => {
    it('should register routes', () => {
        server.route(MainController.routes());
        let routeTable: hapi.IConnectionTable[] = <any>server.table();
        let [mainRoute] = routeTable;
        expect(routeTable.length).to.equal(1);
        expect(mainRoute.table.length).to.equal(2);
    });
});