'use strict';

import * as hapi from 'hapi';
import * as Sequelize from 'sequelize';
import * as conf from 'nconf';
import m from './migrate';
import s from './seed';
import { Webhook, IWebhookInstance } from '../models/webhook.model';

let server: hapi.Server;

export function initializeDB(s: hapi.Server) {
    server = s;
}

const DB_DIALECT    = conf.get('DB_DIALECT'),
      DB_HOST       = conf.get('DB_HOST'),
      DB_PORT       = conf.get('DB_PORT'),
      DB_DATABASE   = conf.get('DB_DATABASE'),
      DB_USER       = conf.get('DB_USER'),
      DB_PASSWORD   = conf.get('DB_PASSWORD');
      
export const NOW = (DB_DIALECT === 'mssql') ? Sequelize.fn('GETDATE') : Sequelize.fn('NOW');
export const RESTRICT = (DB_DIALECT === 'mssql') ? 'NO ACTION' : 'RESTRICT';

export const database = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    dialectOptions: {
        encrypt: true
    }
});

const migrate = m(database);
const seed = s(database);

database.authenticate()
    .then(() => {
        migrate().then(() => {
            server.log('info', 'Migrations complete.');
            return database.sync();
        }).then(() => {
            return seed().then(() => {
                server.log('info', 'Seed complete.');
            }).catch((err) => {
                server.log('error', 'failed seed'); 
                server.log('error', err);
            });
        }).catch((err) => {
            server.log('error', 'failed migration');
            server.log('error', err);
        });
    })
    .catch((err) => {
        server.log('error', 'error connecting to database');
        server.log('error', err);
    })

export function columnExists(table: string, column: string): Promise<boolean> {
    let query = `SELECT column_name 
                 FROM information_schema.columns 
                 WHERE table_name='${table}' and column_name='${column}'`;
    
    return database.query(query).spread<boolean>((results: any, metadata: any) => {
        return (results && results.length);
    });
}

export function sqlAttribute(key: string): string {
    if (DB_DIALECT === 'mssql') {
        return `[${key}]`;
    } else {
        return `"${key}"`;
    }
}

export function createSlug(str: string): string {
    return str.toLowerCase().trim()
        .replace(/&/g, '-and-')          // Replace & with 'and'
        .replace(/[\s\W-]+/g, '-')      // Replace spaces, non-word characters and dashes with a single dash (-)
        .replace(/-$/, ''); // Remove last floating dash if exists
}